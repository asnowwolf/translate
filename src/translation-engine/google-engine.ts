import { TranslationEngine } from './translation-engine';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { post } from 'request';
import { TranslationPair } from '../translator/translation-pair';

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
  protected async batchTranslate(pairs: TranslationPair[], format: SentenceFormat): Promise<TranslationPair[]> {
    for (let pair of pairs) {
      const text = SentenceFormatter.toHtml(pair[0], format);
      if (!text.trim()) {
        continue;
      }
      const response = await fetch(`https://translate.googleapis.com/translate_a/t?anno=3&client=gtx&format=html&v=1.0&sl=auto&tl=zh-CN&tc=6&sr=1&mode=1`, {
        q: text,
      });
      const multiSentencesPattern = /<i>(.*?)<\/i>\s*<b>(.*?)<\/b>/g;
      const translation = ((response?.[0]?.[0] ?? '') as string).replace(/^<p>([\s\S]*)<\/p>$/, '$1');
      pair[1] = SentenceFormatter.fromHtml(translation.replace(multiSentencesPattern, '$2'), format);
    }
    return pairs;
  }
}
