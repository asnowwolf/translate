import { TranslationEngine } from './translation-engine';

export class FakeTranslationEngine extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    return texts.map(text => {
      if (text.includes('No-translate')) {
        return text;
      }
      if (text.startsWith('<')) {
        return text.replace(/<([-\w]+)\b([^>]*)>([\s\S]*?)<\/\1>/g, '<$1$2>译$3</$1>');
      } else {
        return '[译]' + text;
      }
    });
  }
}
