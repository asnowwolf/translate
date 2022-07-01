import { TranslationEngine } from './translation-engine';
import { Md } from '../dom/unified/md';

export class NormalizeTranslationEngine extends TranslationEngine {
  protected async batchTranslate(texts: string[]): Promise<string[]> {
    return texts.map(text => Md.normalize(text).trim());
  }
}
