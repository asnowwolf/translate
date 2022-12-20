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
  extract(filename: string): DictEntry[];
}

export abstract class AbstractExtractor implements Extractor {
  extract(filename: string): DictEntry[] {
    return this.extractSentencePairsFromFile(filename)
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

  extractSentencePairsFromFile(filename: string): SentencePair[] {
    const content = readFileSync(filename, 'utf8');
    return this.extractSentencePairsFromContent(content);
  }

  abstract extractSentencePairsFromContent(content: string): SentencePair[];
}
