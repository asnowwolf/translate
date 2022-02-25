export type DictEntryConfidence =
// 人工翻译
  'Manual' |
  // 词典精确翻译：文件名一致
  'DictAccurate' |
  // 词典模糊翻译：文件名不一致，但内容匹配
  'DictFuzzy' |
  // 正则翻译
  'DictRegExp' |
  // 翻译引擎自动翻译
  'Engine';


export interface DictEntry {
  id: string;
  path: string;
  english: string;
  chinese: string;
  confidence: DictEntryConfidence;
  isRegExp: boolean;
}

export interface AdditionalCriteria {
  [key: string]: any;

  path?: string;
  includeRegExp?: boolean;
}

export interface Dict {
  open(folder: string): Promise<void>;

  close(): Promise<void>;

  get(english: string, criteria?: AdditionalCriteria): Promise<DictEntry>;

  query(criteria?: AdditionalCriteria): Promise<DictEntry[]>;

  createOrUpdate(english: string, chinese: string, criteria?: AdditionalCriteria): Promise<DictEntry>;

  save(entry: DictEntry): Promise<DictEntry>;
}
