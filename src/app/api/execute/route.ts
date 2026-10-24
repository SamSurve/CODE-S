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

    // Base64 encode source code and stdin to ensure safe transfer across all charsets
    const judge0Payload = {
      source_code: encodeBase64(source_code),
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
