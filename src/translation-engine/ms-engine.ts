import * as request from 'request-promise-native';
import { v4 } from 'uuid';
import { TranslationEngine } from './translation-engine';
import { htmlToMd, mdToHtml } from '../utils/markdown';

export class MsTranslationEngine extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    if (!process.env.MS_TRANSLATOR) {
      throw new Error('Environment variable for your subscription key is not set.');
    }

    const results = await request({
      method: 'POST',
      baseUrl: 'https://api.cognitive.microsofttranslator.com/',
      url: 'translate',
      qs: {
        'api-version': '3.0',
        'to': 'zh-Hans',
        category: '1a5430e5-383d-45be-a1ba-b3d99d0176f8-TECH',
        textType: 'html',
      },
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.MS_TRANSLATOR,
        'Content-type': 'application/json',
        'X-ClientTraceId': v4().toString(),
      },
      body: texts.map(text => ({
        'text': mdToHtml(text),
      })),
      json: true,
    }) as TranslationResult[];
    return results[0].translations.map(it => htmlToMd(it.text));
  }
}

interface DetectedLanguage {
  language: string;
  score: number;
}

interface TranslationText {
  text: string;
  to: string;
}

interface TranslationResult {
  detectedLanguage: DetectedLanguage;
  translations: TranslationText[];
}
