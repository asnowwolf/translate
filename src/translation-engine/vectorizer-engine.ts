import { TranslationEngine } from './translation-engine';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { getNewFilenameFor } from './get-new-filename-for';
import { getDistance } from '../utils/get-distance';
import { TranslationPair } from '../translator/translation-pair';
import { containsChinese } from '../dom/common';
import { createEmbedding } from '../utils/create-embedding';

interface VectorEntry {
  english: string;
  englishVector: number[];
  chinese: string;
  chineseVector: number[];
  distance: number;
}

export class VectorizerEngine extends TranslationEngine {
  constructor(private options: { dict?: string, cwd?: string } = {}) {
    super();
  }

  private _entries: VectorEntry[] = [];

  get entries(): Readonly<VectorEntry>[] {
    return this._entries;
  }

  private getDictFilename(): string {
    const dict = this.options.dict;
    if (dict) {
      const cwd = this.options.cwd;
      const currentFile = this.currentFile;
      return getNewFilenameFor(currentFile, cwd, dict, '.vector.json');
    }
  }

  protected async batchTranslate(sentences: TranslationPair[], format: SentenceFormat): Promise<TranslationPair[]> {
    if (existsSync(this.getDictFilename())) {
      return sentences;
    }
    // 向量化只针对有翻译结果的句子
    const filteredSentences = sentences
      .filter(([original, translation]) => !!translation && containsChinese(translation) && !original.includes('<div className="breadcrumb-container">'))
      .map(([original, translation]) => [
        SentenceFormatter.toMarkdown(original.trim(), format),
        SentenceFormatter.toMarkdown(translation.trim(), format),
      ] as TranslationPair);
    if (!filteredSentences.length) {
      return sentences;
    }
    const originalVectors = await this.getVectors(filteredSentences.map(it => it[0]));
    const translatedVectors = await this.getVectors(filteredSentences.map(it => it[1]));

    for (let i = 0; i < filteredSentences.length; ++i) {
      const [english, chinese] = filteredSentences[i];
      const englishVector = originalVectors[i];
      const chineseVector = translatedVectors[i];
      const distance = getDistance(englishVector, chineseVector);
      if (distance > 0.2) {
        console.warn(`distance: ${distance}, english: ${english}, chinese: ${chinese}`);
      }
      const newEntry = {
        english,
        englishVector,
        chinese,
        chineseVector,
        distance,
      };
      this._entries.push(newEntry);
    }
    // 原封不动返回，因为我们并不想改变翻译结果
    return sentences;
  }

  async setup(currentFile: string): Promise<void> {
    await super.setup(currentFile);
    this._entries = [];
  }

  async tearDown(): Promise<void> {
    const dict = this.getDictFilename();
    if (dict && this.entries.length) {
      const dir = dirname(dict);
      mkdirSync(dir, { recursive: true });
      writeFileSync(dict, JSON.stringify(this.entries), 'utf8');
    }
  }

  private async getVectors(texts: string[]): Promise<number[][]> {
    return createEmbedding(texts);
  }
}

