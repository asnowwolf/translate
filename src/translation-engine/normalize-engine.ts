import { TranslationEngine } from './translation-engine';
import { markdown } from '../dom/unified/markdown';
import { TranslationPair } from '../translator/translation-pair';

export class NormalizeTranslationEngine extends TranslationEngine {
  protected async batchTranslate(pairs: TranslationPair[]): Promise<TranslationPair[]> {
    for (let pair of pairs) {
      pair[0] = markdown.normalize(pair[0]);
    }
    return pairs;
  }
}
