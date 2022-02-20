import { Connection, ConnectionOptions, createConnection, Repository } from 'typeorm';
import { DictEntryEntity } from './dict-entry.entity';
import { basename, extname, resolve } from 'path';
import { existsSync } from 'fs';
import { basenameWithoutExt } from '../utils/common';
import { Dict } from './dict';

export class SqliteDict implements Dict {
  private connection: Connection;
  private dictRepo: Repository<DictEntryEntity>;
  private regExps: DictEntryEntity[] = [];

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
    // 支持正则匹配，如果在数据库中存在大量正则表达式，则可能出现性能问题。
    this.regExps = await this.dictRepo.find({ isRegExp: true });
  }

  async close() {
    return this.connection.close();
  }

  async get(path: string, english: string): Promise<DictEntryEntity> {
    const entries = await this.dictRepo.find({ english });
    const entity = entries.find(it => it.path === path) ??
      entries.find(it => basename(it.path) === basename(path)) ??
      entries.find(it => basenameWithoutExt(it.path) === basenameWithoutExt(path));
    return entity ?? (entries[0] ? { ...entries[0], confidence: 'DictFuzzy' } : this.findByRegExp(english));
  }

  async query(includeRegExp = true): Promise<DictEntryEntity[]> {
    return await this.dictRepo.find({ where: { isRegExp: !includeRegExp } });
  }

  async createOrUpdate(path: string, english: string, chinese: string): Promise<DictEntryEntity> {
    const entry = await this.dictRepo.findOne({ path, english });
    if (entry) {
      entry.chinese = chinese;
      entry.confidence = 'Manual';
      return await this.dictRepo.save(entry);
    } else {
      return await this.dictRepo.save({ path, english, chinese, filename: basename(path), confidence: 'Manual' });
    }
  }

  async save(entry: DictEntryEntity): Promise<DictEntryEntity> {
    return this.dictRepo.save(entry);
  }

  private findByRegExp(english: string): DictEntryEntity {
    const entry = this.regExps.find(it => new RegExp(it.english).test(english));
    if (!entry) {
      return;
    }
    const chinese = english.replace(new RegExp(entry.english, 'g'), entry.chinese);
    return { ...entry, chinese, confidence: 'DictFuzzy' };
  }
}
