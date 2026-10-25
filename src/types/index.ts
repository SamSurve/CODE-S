export type SupportedLanguage = 'c' | 'cpp' | 'java' | 'html' | 'javascript';

export interface ExecutionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
}

export interface Judge0Status {
  id: number;
  description: string;
}

export interface ExecutionResponse {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  time?: string | null;
  memory?: number | null;
  status: Judge0Status;
  token?: string;
  error?: string;
  engine?: string;
}

export interface CustomRunnerConfig {
  apiUrl?: string;
  apiKey?: string;
  apiHost?: string;
  authToken?: string;
}
