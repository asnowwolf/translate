import { v3 } from '@google-cloud/translate';
import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { join } from 'path';
import { delay } from '../dom/delay';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';

export class GoogleCloudTranslationEngine extends TranslationEngine {
  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  protected async batchTranslate(texts: string[], format: SentenceFormat): Promise<string[]> {
    const client = new v3.TranslationServiceClient();
    const parent = this.options.parent;
    const model = this.options.model && join(parent, 'models', this.options.model);
    const glossary = this.options.glossary && join(parent, 'glossaries', this.options.glossary);
    return client.translateText({
      parent,
      contents: texts.map(it => SentenceFormatter.toHtml(it, format)),
      mimeType: 'text/html', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: 'zh',
      model,
      glossaryConfig: {
        glossary,
      },
    }).then(it => it[0]!.translations!.map(it => SentenceFormatter.fromHtml(it.translatedText!!, format))).catch((err) => {
      if (err.code === ERROR_RESOURCE_EXHAUSTED) {
        return delay(60 * 1000).then(() => this.batchTranslate(texts, format));
      }
      throw err;
    });
  }
}

const ERROR_RESOURCE_EXHAUSTED = 8;
