import { mkdirSync, writeFileSync } from 'fs';
import { traverse } from '../utils/traverse';
import { dirname, extname, join, parse } from 'path';
import { getExtractorFor } from '../extractor/get-extractor-for';

export enum DictEntryConfidence {
  // 人工翻译
  Manual = 'Manual',
  // 翻译引擎自动翻译
  Engine = 'Engine',
}

export interface DictEntry {
  english: string;
  chinese: string;
  confidence: DictEntryConfidence;
}

function normalizeTableName(tableName: string) {
  const { dir, name } = parse(tableName);
  return join(dir, name);
}

export class Dict {
  private tables: Map<string, DictEntry[]> = new Map();

  open(folder: string): void {
    this.load(folder);
  }

  close(): void {
    this.flush();
  }

  private load(folder: string): void {
    mkdirSync(folder, { recursive: true });
    const files = Array.from(traverse(folder))
      .filter((file) => extname(file) === '.md' && !file.endsWith('.new.md'))
      .sort().reverse();
    for (let file of files) {
      this.tables.set(normalizeTableName(file), getExtractorFor(file).extract(file));
    }
  }

  flush(): void {
    for (let [tableName, entries] of this.tables.entries()) {
      const content = entries.map((entry) => [entry.english, entry.chinese].join('\n\n')).join('\n\n');
      const filename = `${tableName}.dict.md`;
      mkdirSync(dirname(filename), { recursive: true });
      writeFileSync(filename, content, 'utf8');
    }
  }

  save(tableName: string, entry: DictEntry): DictEntry {
    const existsEntry = this.get(entry.english);
    if (existsEntry) {
      Object.assign(existsEntry, entry);
      return existsEntry;
    }

    tableName = normalizeTableName(tableName);
    const table = this.findOrCreateTable(tableName);
    table.push(entry);
    return entry;
  }

  get(english: string): DictEntry {
    for (let table of this.tables.values()) {
      const entry = table.find((entry) => entry.english === english);
      if (entry) {
        return entry;
      }
    }
  }

  private findOrCreateTable(tableName: string): DictEntry[] {
    const table = this.tables.get(tableName);
    if (table) {
      return table;
    }
    return this.tables.set(tableName, []).get(tableName);
  }

  query(english?: string): DictEntry[] {
    return Array.from(this.tables.values()).flat()
      .filter((entry) => !english || entry.english === english);
  }
}
