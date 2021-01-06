import * as request from 'request-promise-native';
import { v4 } from 'uuid';
import { TranslationEngineType } from './common';
import { v3 } from '@google-cloud/translate';
import * as translate from '@vitalets/google-translate-api';
import { readFileSync } from 'fs';

export abstract class TranslationEngine {
  batchSize = 100;

  init(params: Record<string, any>): void {
  }

  async translate(texts: string[]): Promise<string[]> {
    if (!texts.length) {
      return texts;
    }
    return await this.doTranslate(texts);
  }

  protected abstract async doTranslate(texts: string[]): Promise<string[]>;
}

export function getTranslateEngine(engine: TranslationEngineType): TranslationEngine {
  switch (engine) {
    case TranslationEngineType.google:
      return new GoogleTranslator();
    case TranslationEngineType.gcloud:
      return new GoogleCloudTranslator();
    case TranslationEngineType.ms:
      return new MsTranslator();
    case TranslationEngineType.dict:
      return new DictTranslator();
    case TranslationEngineType.fake:
      return new FakeTranslator();
    default:
      throw new Error('Unknown Translation Engine type');
  }
}

export class MsTranslator extends TranslationEngine {
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
        'text': text,
      })),
      json: true,
    }) as TranslationResult[];
    return results[0].translations.map(it => it.text);
  }
}

export class GoogleCloudTranslator extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    const client = new v3.TranslationServiceClient();
    return client.translateText({
      parent: `projects/ralph-gde/locations/us-central1`,
      contents: texts,
      mimeType: 'text/html', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: 'zh-cn',
      model: 'projects/ralph-gde/locations/us-central1/models/TRL9199068616738092360',
    }).then(it => it[0]!.translations!.map(it => it.translatedText!!));
  }
}

export class GoogleTranslator extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    return Promise.all(texts.map(text => translate(text, { from: 'en', to: 'zh-CN' }).then(it => it.text)));
  }
}

export class DictTranslator extends TranslationEngine {
  private dict: Map<string, string>;
  private params: Record<string, any>;

  init(params: Record<string, any>): void {
    this.params = params;
  }

  protected async doTranslate(texts: string[]): Promise<string[]> {
    this.load();
    return texts.map(text => this.dict[text] || text);
  }

  private load(): void {
    if (this.dict) {
      return;
    }
    this.dict = new Map<string, string>();
    const pairs = readFileSync(this.params['dict'], 'utf-8').split('\n');
    pairs.map(pair => pair.split('\t')).forEach(([en, cn]) => this.dict.set(en, cn));
  }
}

export class FakeTranslator extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    return texts.map(text => {
      if (text.includes('No-translate')) {
        return text;
      }
      if (text.startsWith('<')) {
        return text.replace(/<([-\w]+)\b([^>]*)>([\s\S]*?)<\/\1>/g, '<$1$2>译$3</$1>');
      } else {
        return '[译]' + text;
      }
    });
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
