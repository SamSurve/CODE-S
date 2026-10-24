export type SupportedLanguage = 'c' | 'cpp';

export interface Practical {
  id: string;
  expNumber: string;
  title: string;
  category: 'Sorting' | 'Searching' | 'Dynamic Programming' | 'Graph Algorithms' | 'Backtracking' | 'Branch & Bound' | 'String Matching' | 'Divide & Conquer';
  paradigm: 'Divide & Conquer' | 'Dynamic Programming' | 'Greedy' | 'Backtracking' | 'Branch & Bound' | 'Brute Force';
  aim: string;
  algorithm: string[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  author: string;
  sourceCode: string;
  language: SupportedLanguage;
  sampleInput: string;
  sampleOutput: string;
  description: string;
}

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
