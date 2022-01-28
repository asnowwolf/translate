import { v3 } from '@google-cloud/translate';
import { TranslationEngine } from './translation-engine';
import { htmlToMd, mdToHtml } from '../utils/markdown';
import { TranslationEngineOptions } from './translation-engine-options';
import { join } from 'path';

export class GoogleCloudTranslationEngine extends TranslationEngine {
  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  protected async doTranslate(texts: string[]): Promise<string[]> {
    const client = new v3.TranslationServiceClient();
    const parent = this.options.parent;
    const model = this.options.model === 'none' ? join(parent, 'models', this.options.model) : undefined;
    const glossary = this.options.glossary === 'none' ? join(parent, 'glossaries', this.options.glossary) : undefined;
    return client.translateText({
      parent,
      contents: texts.map(it => mdToHtml(it)),
      mimeType: 'text/html', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: 'zh-Hans',
      model,
      glossaryConfig: {
        glossary,
      },
    }).then(it => it[0]!.translations!.map(it => htmlToMd(it.translatedText!!)));
  }
}
