import { TranslationEngine } from './translation-engine';

export class FakeTranslationEngine extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    return texts.map(text => {
      if (text) {
        if (text === 'no-translate') {
          return 'no-translate';
        }
        return text.trim() + '译';
      } else {
        return text;
      }
    });
  }
}
