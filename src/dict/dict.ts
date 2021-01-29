import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection, FindManyOptions, Repository } from 'typeorm';
import { basename, resolve } from 'path';
import { existsSync } from 'fs';
import { DictEntryEntity } from './dict-entry.entity';
import { basenameWithoutExt } from '../common';

export class Dict {
  private connection: Connection;
  private dictRepo: Repository<DictEntryEntity>;

  async open(filename: string): Promise<void> {
    const isMemory = filename === inMemoryDbName || !filename;
    const fileDbName = resolve(`${filename}.sqlite`);
    const options: ConnectionOptions = {
      type: 'better-sqlite3',
      database: isMemory ? inMemoryDbName : fileDbName,
      entities: [DictEntryEntity],
      synchronize: isMemory || !existsSync(fileDbName),
    };
    this.connection = await createConnection(options);
    this.dictRepo = this.connection.getRepository(DictEntryEntity);
  }

  async openInMemory(): Promise<void> {
    return this.open(inMemoryDbName);
  }

  async close() {
    return this.connection.close();
  }

  async find(filePath: string, english: string): Promise<DictEntryEntity> {
    const entries = await this.dictRepo.find({ english });
    return entries.find(it => it.path === filePath) ??
      entries.find(it => basename(it.path) === basename(filePath)) ??
      entries.find(it => basenameWithoutExt(it.path) === basenameWithoutExt(filePath)) ??
      entries[0];
  }

  async findAll(options?: FindManyOptions<DictEntryEntity>): Promise<DictEntryEntity[]> {
    return await this.dictRepo.find(options);
  }

  async createOrUpdate(filePath: string, english: string, chinese: string, xpath: string): Promise<DictEntryEntity> {
    const entry = await this.dictRepo.findOne({ path: filePath, english });
    if (entry) {
      entry.chinese = chinese;
      entry.xpath = xpath;
      return await this.dictRepo.save(entry);
    } else {
      return await this.dictRepo.save({ path: filePath, xpath, english, chinese, filename: basename(filePath) });
    }
  }
}

const inMemoryDbName = ':memory:';
