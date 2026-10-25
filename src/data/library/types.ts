export type ItemMode = 'console' | 'web' | 'static';

export interface ItemFile {
  name: string;
  code: string;
}

export interface Item {
  id: string;
  expNo: string;
  language: string;
  files: ItemFile[];
  mainFile?: string;
  sampleInput?: string;
  savedOutput: string;
  mode: ItemMode;
}

export interface Subject {
  id: string;
  name: string;
  items: Item[];
}

export interface ItemSummary {
  id: string;
  expNo: string;
}
