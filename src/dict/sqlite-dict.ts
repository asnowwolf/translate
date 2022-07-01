import { Connection, ConnectionOptions, createConnection, Repository } from 'typeorm';
import { extname, resolve } from 'path';
import { existsSync } from 'fs';
import { AdditionalCriteria, Dict, DictEntry, DictEntryConfidence } from './dict';
import { DictEntryEntity } from './dict-entry.entity';
import { SentenceFormatter } from '../translation-engine/sentence-formatter';
import { SentenceFormat } from '../translator/sentence-format';
import { leven } from './leven';
import { generateFingerprint } from './generate-fingerprint';

export class SqliteDict implements Dict {
  private connection: Connection;
  private dictRepo: Repository<DictEntryEntity>;

  async open(folder = ''): Promise<void> {
    const isMemory = folder === ':memory:' || !folder;
    if (!isMemory && !extname(folder)) {
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

  async get(english: string, format: SentenceFormat, criteria?: AdditionalCriteria): Promise<DictEntry> {
    function chineseDotFor(english: string, chinese: string): string {
      if (/[^.]\.$/.test(english) && !chinese.endsWith('。')) {
        return '。';
      } else {
        return '';
      }
    }

    const entries = (await this.findEntries(generateFingerprint(english, format), format))
      .map(it => ({
        ...it,
        chinese: it.chinese + chineseDotFor(english, it.chinese),
      }));

    entries.sort((a, b) => leven(a.english, english) - leven(b.english, english));
    // 全路径匹配优先，其次是文件名，最后是基本名
    const entry = entries[0];

    function computeConfidenceOf(text1: string, text2: string): DictEntryConfidence {
      const diff = leven(text1.trim(), text2.trim());
      // 如果差异小于某个阈值，则认为是精确的，否则认为是模糊的
      return diff === 0 || text1.length / diff > 20 ? 'DictAccurate' : 'DictFuzzy';
    }

    // 路径、文件名、基本名都不匹配的，视为字典模糊搜索
    if (entry) {
      return { ...entry, confidence: computeConfidenceOf(entry.english, english) };
    } else {
      return findByRegExp(english, await this.dictRepo.find({ isRegExp: true }));
    }
  }

  private async findEntries(fingerprint: string, format: SentenceFormat): Promise<DictEntryEntity[]> {
    const itemsInSameFormat = await this.dictRepo.find({ fingerprint, format });
    if (itemsInSameFormat.length > 0) {
      return itemsInSameFormat;
    }
    // 格式不同时，映射成期望的格式
    return await this.dictRepo.find({ fingerprint })
      .then(items => items.map(item => ({
        ...item,
        english: SentenceFormatter.fromHtml(SentenceFormatter.toHtml(item.english, item.format), format),
        chinese: SentenceFormatter.fromHtml(SentenceFormatter.toHtml(item.chinese, item.format), format),
        format,
      })));
  }

  async query(criteria?: AdditionalCriteria): Promise<DictEntry[]> {
    return await this.dictRepo.find({ where: !criteria?.includeRegExp ? { isRegExp: false } : undefined });
  }

  async createOrUpdate(english: string, chinese: string, format: SentenceFormat, criteria?: AdditionalCriteria): Promise<DictEntry> {
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
        format,
        fingerprint: generateFingerprint(english, format),
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

