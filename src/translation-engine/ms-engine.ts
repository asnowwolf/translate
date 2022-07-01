import * as request from 'request-promise-native';
import { v4 } from 'uuid';
import { TranslationEngine } from './translation-engine';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';

export class MsTranslationEngine extends TranslationEngine {
  protected async batchTranslate(texts: string[], format: SentenceFormat): Promise<string[]> {
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
        'text': SentenceFormatter.toHtml(text, format),
      })),
      json: true,
    }) as TranslationResult[];
    return results[0].translations.map(it => SentenceFormatter.fromHtml(it.text, format));
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
