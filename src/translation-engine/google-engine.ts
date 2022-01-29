import { TranslationEngine } from './translation-engine';
import * as translate from '@vitalets/google-translate-api';

export class GoogleTranslationEngine extends TranslationEngine {
  protected async doTranslateHtml(texts: string[]): Promise<string[]> {
    return Promise.all(texts.map(text => translate(text, { from: 'en', to: 'zh-CN' }).then(it => it.text)));
  }
}
