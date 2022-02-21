import { TranslationEngine } from './translation-engine';
import { delay } from '../dom/delay';

export class FakeTranslationEngine extends TranslationEngine {
  protected async doTranslateHtml(texts: string[]): Promise<string[]> {
    const result = texts.map(text => {
      return text
        .replace(/\bone\b/gi, '一')
        .replace(/\btwo\b/gi, '二')
        .replace(/\bthree\b/gi, '三')
        .replace(/\bfour\b/gi, '四')
        .replace(/\bfive\b/gi, '五')
        .replace(/\bsix\b/gi, '六')
        .replace(/\bseven\b/gi, '七')
        .replace(/\beight\b/gi, '八')
        .replace(/\bnine\b/gi, '九')
        ;
    });
    return delay(200).then(() => result);
  }
}
