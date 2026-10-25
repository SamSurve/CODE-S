import { NextRequest, NextResponse } from 'next/server';

function decodeBase64(str: string | null | undefined): string | null {
  if (!str) return null;
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    return str;
  }
}

function encodeBase64(str: string | null | undefined): string {
  if (!str) return '';
  return Buffer.from(str, 'utf-8').toString('base64');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source_code, language_id, stdin } = body;

    if (!source_code || typeof source_code !== 'string') {
      return NextResponse.json(
        {
          error: 'Source code is required.',
          status: { id: 13, description: 'Internal Error' }
        },
        { status: 400 }
      );
    }

    if (!language_id || typeof language_id !== 'number') {
      return NextResponse.json(
        {
          error: 'Valid language_id is required (e.g. 50 for C, 54 for C++, 62 for Java).',
          status: { id: 13, description: 'Internal Error' }
        },
        { status: 400 }
      );
    }

    // Check custom headers first, then fall back to server environment variables
    const customUrl = req.headers.get('x-judge0-url');
    const customKey = req.headers.get('x-judge0-key');
    const customHost = req.headers.get('x-judge0-host');
    const customToken = req.headers.get('x-judge0-token');

    const apiUrl =
      customUrl ||
      process.env.JUDGE0_API_URL ||
      'https://ce.judge0.com';

    const apiKey = customKey || process.env.JUDGE0_API_KEY;
    const apiHost = customHost || process.env.JUDGE0_API_HOST;
    const authToken = customToken || process.env.JUDGE0_AUTH_TOKEN;

    // Build Judge0 headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    // Only inject RapidAPI headers if an API key is actually provided OR if using RapidAPI endpoint
    if (apiKey) {
      headers['X-RapidAPI-Key'] = apiKey;
      if (apiHost) {
        headers['X-RapidAPI-Host'] = apiHost;
      } else if (apiUrl.includes('rapidapi.com')) {
        headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
      }
    } else if (apiUrl.includes('rapidapi.com') && apiHost) {
      headers['X-RapidAPI-Host'] = apiHost;
    }

    if (authToken) {
      headers['X-Auth-Token'] = authToken;
    }

    // Terminal Echo Simulation:
    let codeToSend = source_code;
    if ((language_id === 50 || language_id === 54) && !source_code.includes('echo_cookie_funcs')) {
      // C / C++ stdin echo shim using fopencookie
      const fileName = language_id === 54 ? 'main.cpp' : 'main.c';
      const shim = `
#ifndef _GNU_SOURCE
#define _GNU_SOURCE
#endif
#ifdef __cplusplus
extern "C" {
#endif
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>

static int orig_stdin_fd = -1;
static char echo_line_buf[8192];
static size_t echo_line_len = 0;
static size_t echo_line_pos = 0;

static ssize_t echo_cookie_read(void *cookie, char *buf, size_t size) {
    if (size == 0) return 0;
    if (echo_line_pos >= echo_line_len) {
        echo_line_len = 0;
        echo_line_pos = 0;
        while (echo_line_len < sizeof(echo_line_buf) - 1) {
            char ch;
            ssize_t n = read(orig_stdin_fd, &ch, 1);
            if (n <= 0) break;
            echo_line_buf[echo_line_len++] = ch;
            if (ch == '\\n') break;
        }
        if (echo_line_len == 0) return 0;
        fflush(stdout);
        write(1, echo_line_buf, echo_line_len);
        if (echo_line_buf[echo_line_len - 1] != '\\n') {
            write(1, "\\n", 1);
        }
    }
    size_t avail = echo_line_len - echo_line_pos;
    size_t toCopy = size < avail ? size : avail;
    memcpy(buf, echo_line_buf + echo_line_pos, toCopy);
    echo_line_pos += toCopy;
    return toCopy;
}

static cookie_io_functions_t echo_cookie_funcs = {
    echo_cookie_read,
    NULL,
    NULL,
    NULL
};

__attribute__((constructor)) static void init_echo_stdin(void) {
    orig_stdin_fd = dup(0);
    FILE *new_in = fopencookie(NULL, "r", echo_cookie_funcs);
    if (new_in) {
        setvbuf(new_in, NULL, _IONBF, 0);
        stdin = new_in;
    }
}
#ifdef __cplusplus
}
#endif
#line 1 "${fileName}"
`;
      codeToSend = shim + '\n' + source_code;
    } else if ((language_id === 62 || language_id === 91) && !source_code.includes('__TerminalEchoInputStream')) {
      // Java execution on Judge0:
      // 1. Rename the class containing main() to Main everywhere in the source
      const mainIdx = codeToSend.search(/\bpublic\s+static\s+void\s+main\b/);
      if (mainIdx !== -1) {
        const beforeMain = codeToSend.slice(0, mainIdx);
        const classMatches = [...beforeMain.matchAll(/(?:public\s+)?class\s+([A-Za-z0-9_$]+)/g)];
        if (classMatches.length > 0) {
          const mainClassName = classMatches[classMatches.length - 1][1];
          if (mainClassName && mainClassName !== 'Main') {
            const classRegex = new RegExp(`("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')|\\b${mainClassName}\\b`, 'g');
            codeToSend = codeToSend.replace(classRegex, (match, str) => {
              if (str) return str;
              return 'Main';
            });
          }
        }
      }

      // 2. Insert System.setIn shim right after opening brace of main()
      codeToSend = codeToSend.replace(
        /(public\s+static\s+void\s+main\s*\([^)]*\)\s*(?:throws\s+[^{]+)?\{)/,
        '$1 System.setIn(new __TerminalEchoInputStream(System.in));'
      );

      // 3. Append helper class at END of file so line numbers do not shift
      const javaHelper = `
class __TerminalEchoInputStream extends java.io.InputStream {
    private final java.io.InputStream in;
    private byte[] lineBuf = new byte[8192];
    private int lineLen = 0;
    private int linePos = 0;

    public __TerminalEchoInputStream(java.io.InputStream in) {
        this.in = in;
    }

    @Override
    public int read() throws java.io.IOException {
        byte[] b = new byte[1];
        int n = read(b, 0, 1);
        return n <= 0 ? -1 : (b[0] & 0xff);
    }

    @Override
    public int read(byte[] b, int off, int len) throws java.io.IOException {
        if (len <= 0) return 0;
        if (linePos >= lineLen) {
            lineLen = 0;
            linePos = 0;
            while (lineLen < lineBuf.length) {
                int c = in.read();
                if (c == -1) break;
                lineBuf[lineLen++] = (byte) c;
                if (c == '\\n') break;
            }
            if (lineLen == 0) return -1;
            System.out.write(lineBuf, 0, lineLen);
            if (lineBuf[lineLen - 1] != '\\n') {
                System.out.write('\\n');
            }
            System.out.flush();
        }
        int avail = lineLen - linePos;
        int toCopy = Math.min(len, avail);
        System.arraycopy(lineBuf, linePos, b, off, toCopy);
        linePos += toCopy;
        return toCopy;
    }

    @Override
    public int available() {
        return 0;
    }
}
`;
      codeToSend = codeToSend + '\n' + javaHelper;
    }

    // Base64 encode source code and stdin to ensure safe transfer across all charsets
    const judge0Payload = {
      source_code: encodeBase64(codeToSend),
      language_id,
      stdin: stdin ? encodeBase64(stdin) : ''
    };

    const targetUrl = `${apiUrl.replace(/\/+$/, '')}/submissions?base64_encoded=true&wait=true`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000); // 35s timeout

    let response: Response;
    try {
      response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(judge0Payload),
        signal: controller.signal
      });
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isAbort = (err as Error)?.name === 'AbortError';
      const msg = isAbort
        ? 'Execution request timed out after 35 seconds. If the code is waiting for standard input, please ensure all required input is provided in the Custom Standard Input panel.'
        : `Unable to connect to execution API at ${apiUrl}. Please verify network connectivity.`;

      return NextResponse.json(
        {
          error: msg,
          status: { id: isAbort ? 5 : 13, description: isAbort ? 'Time Limit Exceeded' : 'Service Unavailable' },
          stdout: null,
          stderr: msg,
          compile_output: null,
          time: null,
          memory: null
        },
        { status: 503 }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr: { message?: string; error?: string } = {};
      try {
        parsedErr = JSON.parse(errText);
      } catch {
        // Not JSON
      }

      const errorMessage =
        parsedErr.message ||
        parsedErr.error ||
        `Service returned status ${response.status}: ${errText || response.statusText}`;

      return NextResponse.json(
        {
          error: errorMessage,
          status: { id: 13, description: `API Error (${response.status})` },
          stdout: null,
          stderr: errorMessage,
          compile_output: null
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Decode base64 outputs returned by Judge0
    const decodedStdout = decodeBase64(data.stdout);
    let decodedStderr = decodeBase64(data.stderr);
    let decodedCompileOutput = decodeBase64(data.compile_output);
    const decodedMessage = decodeBase64(data.message);

    // Sanitize helper references from errors so helper is never revealed
    if (decodedStderr && decodedStderr.includes('__TerminalEchoInputStream')) {
      decodedStderr = decodedStderr
        .split('\n')
        .filter((l) => !l.includes('__TerminalEchoInputStream'))
        .join('\n');
    }
    if (decodedCompileOutput && decodedCompileOutput.includes('__TerminalEchoInputStream')) {
      decodedCompileOutput = decodedCompileOutput
        .split('\n')
        .filter((l) => !l.includes('__TerminalEchoInputStream'))
        .join('\n');
    }

    return NextResponse.json({
      stdout: decodedStdout,
      stderr: decodedStderr,
      compile_output: decodedCompileOutput,
      message: decodedMessage,
      time: data.time || null,
      memory: data.memory || null,
      status: data.status || { id: 3, description: 'Accepted' },
      token: data.token || null,
      engine: apiUrl.includes('rapidapi') ? 'Remote API (RapidAPI)' : 'Sandboxed Engine'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      {
        error: message,
        status: { id: 13, description: 'Internal Server Error' },
        stderr: message
      },
      { status: 500 }
    );
  }
}
