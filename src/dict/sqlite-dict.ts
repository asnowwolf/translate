import { Connection, ConnectionOptions, createConnection, Repository } from 'typeorm';
import { basename, extname, resolve } from 'path';
import { existsSync } from 'fs';
import { basenameWithoutExt } from '../dom/common';
import { AdditionalCriteria, Dict, DictEntry } from './dict';
import { DictEntryEntity } from './dict-entry.entity';

export class SqliteDict implements Dict {
  private connection: Connection;
  private dictRepo: Repository<DictEntryEntity>;

  async open(folder = ''): Promise<void> {
    const isMemory = folder === ':memory:' || !folder;
    if (!extname(folder)) {
      folder += '.sqlite';
    }
    const fileDbName = resolve(folder);
    const options: ConnectionOptions = {
      name: fileDbName,
      type: 'better-sqlite3',
      database: isMemory ? ':memory:' : fileDbName,
      entities: [DictEntryEntity],
      synchronize: isMemory || !existsSync(fileDbName),
    };
    this.connection = await createConnection(options);
    this.dictRepo = this.connection.getRepository(DictEntryEntity);
  }

  async close() {
    return this.connection.close();
  }

  async get(english: string, criteria?: AdditionalCriteria): Promise<DictEntry> {
    const entries = await this.dictRepo.find({ english });
    // 全路径匹配优先，其次是文件名，最后是基本名
    const entity = entries.find(it => it.path === criteria?.path) ??
      entries.find(it => basename(it.path) === basename(criteria?.path ?? '')) ??
      entries.find(it => basenameWithoutExt(it.path) === basenameWithoutExt(criteria?.path));

    if (entity) {
      return { ...entity, confidence: 'DictAccurate' };
    }

    // 路径、文件名、基本名都不匹配的，视为字典模糊搜索
    if (entries[0]) {
      return { ...entries[0], confidence: 'DictFuzzy' };
    } else {
      return findByRegExp(english, await this.dictRepo.find({ isRegExp: true }));
    }
  }

  async query(criteria?: AdditionalCriteria): Promise<DictEntry[]> {
    return await this.dictRepo.find({ where: !criteria?.includeRegExp ? { isRegExp: false } : undefined });
  }

  async createOrUpdate(english: string, chinese: string, criteria?: AdditionalCriteria): Promise<DictEntry> {
    const entry = await this.dictRepo.findOne({ path: criteria?.path, english });
    if (entry) {
      entry.chinese = chinese;
      entry.confidence = 'Manual';
      return await this.dictRepo.save(entry);
    } else {
      return await this.dictRepo.save({
        path: criteria?.path,
        english,
        chinese,
        confidence: 'Manual',
      });
    }
  }

  async save(entry: DictEntry): Promise<DictEntry> {
    return this.dictRepo.save(entry);
  }

}

function findByRegExp(english: string, regExps: DictEntry[]): DictEntry {
  const entry = regExps.find(it => new RegExp(it.english).test(english));
  if (!entry) {
    return;
  }
  const chinese = english.replace(new RegExp(entry.english, 'g'), entry.chinese);
  return { ...entry, chinese, confidence: 'DictRegExp' };
}
