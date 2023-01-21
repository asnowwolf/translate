import { TranslationEngine } from './translation-engine';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { post } from 'request';

function fetch(url: string, data: object): Promise<any> {
  return new Promise((resolve, reject) => {
    post(url, { form: data }, (error, response, body) => {
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
      const text = SentenceFormatter.toHtml(line, format);
      if (!text.trim()) {
        continue;
      }
      const response = await fetch(`https://translate.googleapis.com/translate_a/t?anno=3&client=gtx&format=html&v=1.0&sl=auto&tl=zh-CN&tc=6&sr=1&mode=1`, {
        q: text,
      });
      const translation = response?.[0]?.[0];
      if (translation) {
        result.push(SentenceFormatter.fromHtml(translation, format));
      }
    }
    return result;
  }
}
