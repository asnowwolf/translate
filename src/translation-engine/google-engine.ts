import { TranslationEngine } from './translation-engine';
import * as translate from '@vitalets/google-translate-api';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';

export class GoogleTranslationEngine extends TranslationEngine {
  protected async batchTranslate(texts: string[], format: SentenceFormat): Promise<string[]> {
    return Promise.all(texts.map(text => translate(SentenceFormatter.toPlain(text, format), {
      from: 'en',
      to: 'zh-CN',
    }).then(it => it.text)));
  }
}
