import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from '../translation-engine/sentence-formatter';

export function generateFingerprint(sentence: string, format: SentenceFormat): string {
  return SentenceFormatter.toHtml(sentence, format).replace(/\W/g, '').toLowerCase();
}
