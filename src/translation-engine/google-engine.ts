import { TranslationEngine } from './translation-engine';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { get } from 'request';

function fetch(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    get(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

export class GoogleTranslationEngine extends TranslationEngine {
  protected async batchTranslate(texts: string[], format: SentenceFormat): Promise<string[]> {
    const result: string[] = [];
    for (let line of texts) {
      const text = SentenceFormatter.toPlain(line, format);
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`);
      const translation = response[0].map(([cn]) => cn).join('');
      result.push(translation);
    }
    return result;
  }
}
