import { TranslationEngine } from './translation-engine';
import { SentenceFormat } from '../translator/sentence-format';
import { DictEntry } from '../dict/dict-entry';
import { SentenceFormatter } from './sentence-formatter';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { getDictFilenameFor } from './get-dict-filename-for';

export class ExtractorEngine extends TranslationEngine {
  constructor(private options: { dict?: string, cwd?: string } = {}) {
    super();
  }

  private _entries: DictEntry[] = [];

  get entries(): Readonly<DictEntry>[] {
    return this._entries;
  }

  async translate(original: string, translation: string, format: SentenceFormat): Promise<string> {
    if (this.shouldIgnore(original, format)) {
      return original;
    }
    const newEntry = {
      english: SentenceFormatter.toMarkdown(original.trim(), format),
      chinese: SentenceFormatter.toMarkdown(translation?.trim(), format),
    };
    const existingEntry = this.entries.find(it => it.english === original);
    if (!existingEntry) {
      this._entries.push(newEntry);
    } else {
      Object.assign(existingEntry, newEntry);
    }
    // 返回 original，以免应用翻译结果
    return original;
  }

  protected batchTranslate(sentences: string[], format: SentenceFormat): Promise<string[]> {
    return Promise.resolve(sentences);
  }

  saveToFile(dictFile: string): void {
    const content = this.entries.map((entry) => [entry.english, entry.chinese].join('\n\n')).join('\n\n').trim();
    if (content) {
      const dir = dirname(dictFile);
      mkdirSync(dir, { recursive: true });
      writeFileSync(dictFile, content, 'utf8');
    }
  }

  async setup(currentFile: string): Promise<void> {
    await super.setup(currentFile);
    this._entries = [];
  }

  async tearDown(): Promise<void> {
    const dict = this.options.dict;
    if (dict) {
      const cwd = this.options.cwd;
      const currentFile = this.currentFile;
      const dictFile = getDictFilenameFor(currentFile, cwd, dict);
      this.saveToFile(dictFile);
    }
  }
}
