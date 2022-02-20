import { DictEntryEntity } from './dict-entry.entity';

export interface Dict {
  open(folder: string): Promise<void>;

  close(): Promise<void>;

  get(path: string, english: string): Promise<DictEntryEntity>;

  query(includeRegExp: boolean): Promise<DictEntryEntity[]>;

  createOrUpdate(path: string, english: string, chinese: string): Promise<DictEntryEntity>;

  save(entry: DictEntryEntity): Promise<DictEntryEntity>;
}
