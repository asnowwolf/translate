import { DictEntry } from '../dict/dict';
import { v4 } from 'uuid';
import { SentenceFormat } from '../translator/sentence-format';
import { readFileSync } from 'fs';

export interface SentencePair {
  english: string;
  chinese: string;
  format: SentenceFormat;
}

export interface Extractor {
  extract(filename: string): Promise<DictEntry[]>;
}

export abstract class AbstractExtractor<T> implements Extractor {
  async extract(filename: string): Promise<DictEntry[]> {
    const content = readFileSync(filename, 'utf8');
    const sentencePairs = await this.extractSentencePairs(this.parse(content));
    return sentencePairs
      .filter(it => it.english && it.chinese && it.english !== it.chinese)
      .map(it => ({
        id: v4(),
        english: it.english,
        chinese: it.chinese,
        path: filename,
        format: it.format,
        isRegExp: false,
        confidence: 'Manual',
      }));
  }

  abstract parse(text: string): T;

  abstract extractSentencePairs(dom: T): Promise<SentencePair[]>;
}
