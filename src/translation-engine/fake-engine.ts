import { TranslationEngine } from './translation-engine';

export class FakeTranslationEngine extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    return texts.map(text => text ? text.trim() + '[译]' : text);
  }
}
