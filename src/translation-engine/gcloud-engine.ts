import { v3 } from '@google-cloud/translate';
import { TranslationEngine } from './translation-engine';
import { mdToHtml } from '../markdown';

export class GoogleCloudTranslationEngine extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    const client = new v3.TranslationServiceClient();
    return client.translateText({
      parent: `projects/ralph-gde/locations/us-central1`,
      contents: texts.map(it => mdToHtml(it)),
      mimeType: 'text/html', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: 'zh-cn',
      model: 'projects/ralph-gde/locations/us-central1/models/TRL9199068616738092360',
      glossaryConfig: {
        glossary: 'projects/ralph-gde/locations/us-central1/glossaries/programming',
      },
    }).then(it => it[0]!.translations!.map(it => it.translatedText!!));
  }
}
