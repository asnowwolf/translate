import { v3 } from '@google-cloud/translate';
import { TranslationEngine } from './translation-engine';
import { mdToHtml } from '../markdown';
import { TranslationEngineOptions } from './translation-engine-options';
import { join } from 'path';

export class GoogleCloudTranslationEngine extends TranslationEngine {
  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  protected async doTranslate(texts: string[]): Promise<string[]> {
    const client = new v3.TranslationServiceClient();
    const parent = this.options.parent;
    const model = join(parent, 'models', this.options.model);
    const glossary = join(parent, 'glossaries', this.options.glossary);
    return client.translateText({
      parent,
      contents: texts.map(it => mdToHtml(it)),
      mimeType: 'text/html', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: 'zh-cn',
      model,
      glossaryConfig: {
        glossary,
      },
    }).then(it => it[0]!.translations!.map(it => it.translatedText!!));
  }
}
