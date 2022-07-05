import { TranslationEngine } from './translation-engine';
import { markdown } from '../dom/unified/markdown';

export class NormalizeTranslationEngine extends TranslationEngine {
  protected async batchTranslate(texts: string[]): Promise<string[]> {
    return texts.map(text => markdown.normalize(text).trim());
  }
}
