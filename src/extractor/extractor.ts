import { DictEntry, DictEntryConfidence } from '../dict/dict';
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
    console.log('Extracting from ', filename);
    return this.extractSentencePairsFromFile(filename)
      .filter(it => it.english && it.chinese && it.english !== it.chinese)
      .map(it => ({
        english: it.english,
        chinese: it.chinese,
        confidence: DictEntryConfidence.Manual,
      }));
  }

  extractSentencePairsFromFile(filename: string): SentencePair[] {
    const content = readFileSync(filename, 'utf8');
    return this.extractSentencePairsFromContent(content);
  }

  abstract extractSentencePairsFromContent(content: string): SentencePair[];
}
