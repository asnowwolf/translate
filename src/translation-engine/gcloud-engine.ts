import { v3 } from '@google-cloud/translate';
import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { join } from 'path';
import { delay } from '../dom/delay';

export class GoogleCloudTranslationEngine extends TranslationEngine {
  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  protected async doTranslateHtml(texts: string[]): Promise<string[]> {
    const client = new v3.TranslationServiceClient();
    const parent = this.options.parent;
    const model = this.options.model !== 'none' ? join(parent, 'models', this.options.model) : undefined;
    const glossary = this.options.glossary !== 'none' ? join(parent, 'glossaries', this.options.glossary) : undefined;
    return client.translateText({
      parent,
      contents: texts,
      mimeType: 'text/html', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: 'zh',
      model,
      glossaryConfig: {
        glossary,
      },
    }).then(it => it[0]!.translations!.map(it => it.translatedText!!)).catch((err) => {
      if (err.code === ERROR_RESOURCE_EXHAUSTED) {
        return delay(60 * 1000).then(() => this.doTranslateHtml(texts));
      }
      throw err;
    });
  }
}

const ERROR_RESOURCE_EXHAUSTED = 8;
