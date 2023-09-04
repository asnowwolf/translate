import { TranslationEngine } from './translation-engine';
import { SentenceFormat } from '../translator/sentence-format';
import { DictEntry } from '../dict/dict-entry';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { getNewFilenameFor } from './get-new-filename-for';
import { TranslationPair } from '../translator/translation-pair';
import { SentenceFormatter } from './sentence-formatter';

export class ExtractorEngine extends TranslationEngine {
  constructor(private options: { dict?: string, cwd?: string } = {}) {
    super();
  }

  private _entries: DictEntry[] = [];

  get entries(): Readonly<DictEntry>[] {
    return this._entries;
  }

  protected async batchTranslate(sentences: TranslationPair[], format: SentenceFormat): Promise<TranslationPair[]> {
    for (let [original, translation] of sentences) {
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
    }
    return sentences;
  }

  saveToFile(dictFile: string): void {
    const content = this.entries.map((entry) => [entry.english, entry.chinese].join('\n\n'))
      .join('\n\n')
      .replace(/\n\n\n+/g, '\n\n')
      .trim();
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
      const dictFile = getNewFilenameFor(currentFile, cwd, dict, '.dict.md');
      this.saveToFile(dictFile);
    }
  }
}
