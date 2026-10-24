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
          error: 'Valid language_id is required (e.g. 50 for C, 54 for C++).',
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
    // Prepend a hidden C/C++ shim that intercepts stdin using a fopencookie() stream.
    // Each line read from stdin is automatically echoed to stdout (fd 1) with flushed output,
    // exactly matching an interactive terminal session where typed inputs appear on the terminal.
    let codeToSend = source_code;
    if ((language_id === 50 || language_id === 54) && !source_code.includes('echo_cookie_funcs')) {
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
    size_t to_copy = size < avail ? size : avail;
    memcpy(buf, echo_line_buf + echo_line_pos, to_copy);
    echo_line_pos += to_copy;
    return to_copy;
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
        ? 'Execution request timed out after 20 seconds. If the code is waiting for standard input, please ensure all required input is provided in the Custom Standard Input panel.'
        : `Unable to connect to Judge0 execution API at ${apiUrl}. Please verify network connectivity or configure your execution API credentials in environment variables (JUDGE0_API_URL / JUDGE0_API_KEY).`;

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
        `Judge0 service returned status ${response.status}: ${errText || response.statusText}`;

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
    const decodedStderr = decodeBase64(data.stderr);
    const decodedCompileOutput = decodeBase64(data.compile_output);
    const decodedMessage = decodeBase64(data.message);

    return NextResponse.json({
      stdout: decodedStdout,
      stderr: decodedStderr,
      compile_output: decodedCompileOutput,
      message: decodedMessage,
      time: data.time || null,
      memory: data.memory || null,
      status: data.status || { id: 3, description: 'Accepted' },
      token: data.token || null,
      engine: apiUrl.includes('rapidapi') ? 'Judge0 (RapidAPI)' : 'Judge0 CE'
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
