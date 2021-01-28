import { TranslationEngine } from './translation-engine';

export class NoopTranslationEngine extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    return texts;
  }
}
