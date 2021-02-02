import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection, FindManyOptions, Repository } from 'typeorm';
import { basename, extname, resolve } from 'path';
import { existsSync } from 'fs';
import { DictEntryEntity } from './dict-entry.entity';
import { basenameWithoutExt } from '../common';

export class Dict {
  private connection: Connection;
  private dictRepo: Repository<DictEntryEntity>;
  private regExps: DictEntryEntity[] = [];

  async open(filename = ''): Promise<void> {
    const isMemory = filename === inMemoryDbName || !filename;
    if (!extname(filename)) {
      filename += '.sqlite';
    }
    const fileDbName = resolve(filename);
    const options: ConnectionOptions = {
      type: 'better-sqlite3',
      database: isMemory ? inMemoryDbName : fileDbName,
      entities: [DictEntryEntity],
      synchronize: isMemory || !existsSync(fileDbName),
    };
    this.connection = await createConnection(options);
    this.dictRepo = this.connection.getRepository(DictEntryEntity);
    // 支持正则匹配，如果在数据库中存在大量正则表达式，则可能出现性能问题。
    this.regExps = await this.dictRepo.find({ isRegExp: true });
  }

  async openInMemory(): Promise<void> {
    return this.open(inMemoryDbName);
  }

  async close() {
    return this.connection.close();
  }

  async find(filePath: string, english: string): Promise<DictEntryEntity> {
    const entries = await this.dictRepo.find({ english });
    const entity = entries.find(it => it.path === filePath) ??
      entries.find(it => basename(it.path) === basename(filePath)) ??
      entries.find(it => basenameWithoutExt(it.path) === basenameWithoutExt(filePath));
    return entity ?? (entries[0] ? { ...entries[0], confidence: 'DictFuzzy' } : this.findByRegExp(english));
  }

  async findAll(options?: FindManyOptions<DictEntryEntity>): Promise<DictEntryEntity[]> {
    return await this.dictRepo.find(options);
  }

  async createOrUpdate(filePath: string, english: string, chinese: string, xpath: string): Promise<DictEntryEntity> {
    const entry = await this.dictRepo.findOne({ path: filePath, english });
    if (entry) {
      entry.chinese = chinese;
      entry.xpath = xpath;
      entry.confidence = 'Manual';
      return await this.dictRepo.save(entry);
    } else {
      return await this.dictRepo.save({ path: filePath, xpath, english, chinese, filename: basename(filePath), confidence: 'Manual' });
    }
  }

  findByRegExp(english: string): DictEntryEntity {
    const entry = this.regExps.find(it => new RegExp(it.english).test(english));
    if (!entry) {
      return;
    }
    const chinese = english.replace(new RegExp(entry.english, 'g'), entry.chinese);
    return { ...entry, chinese, confidence: 'DictFuzzy' };
  }
}

const inMemoryDbName = ':memory:';
