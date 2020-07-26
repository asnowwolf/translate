import { from, Observable, of, Subject, Subscription } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import * as request from 'request-promise-native';
import { v4 } from 'uuid';
import { bufferTime, delay, filter, map, publishReplay, refCount, switchMap, take, tap } from 'rxjs/operators';
import { TranslationEngineType } from './common';
import { v3 } from '@google-cloud/translate';
import { readFileSync } from 'fs';

export abstract class TranslationEngine {
  private _original$ = new Subject<{ id: string, original: string }>();
  private _translation$ = new Subject<{ id: string, translation: string }>();
  private subTranslator: Subscription;

  constructor() {
    this.subTranslator = this._original$.pipe(
      bufferTime(100),
      filter(it => it.length > 0),
      publishReplay(1),
      refCount(),
      switchMap(texts => this.batchTranslate(texts.map(it => it.original)).pipe(
        map(translations => translations.map((translation, index) => ({ id: texts[index].id, translation }))),
      )),
      switchMap(it => from(it)),
      tap(it => this._translation$.next(it)),
    ).subscribe();
  }

  destroy(): void {
    this.subTranslator.unsubscribe();
  }

  init(params: Record<string, any>): void {
  }

  translate(text: string): Observable<string> {
    const id = v4();
    this._original$.next({ id, original: text });
    return this._translation$.pipe(
      filter(it => it.id === id),
      map(it => it.translation),
      take(1),
    );
  }

  abstract batchTranslate(texts: string[]): Observable<string[]>;
}

export function getTranslateEngine(engine: TranslationEngineType): TranslationEngine {
  switch (engine) {
    case TranslationEngineType.google:
      return new GoogleTranslator();
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

class MsTranslator extends TranslationEngine {
  batchTranslate(texts: string[]): Observable<string[]> {
    return translateByMsTranslator(texts);
  }
}

class GoogleTranslator extends TranslationEngine {
  batchTranslate(texts: string[]): Observable<string[]> {
    return translateByGoogleCloud(texts);
  }
}

class DictTranslator extends TranslationEngine {
  private dict: Map<string, string>;
  private params: Record<string, any>;

  init(params: Record<string, any>): void {
    this.params = params;
  }

  batchTranslate(texts: string[]): Observable<string[]> {
    this.load();
    return of(texts.map(text => this.dict[text] || text));
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
  batchApiCalls = 0;

  batchTranslate(texts: string[]): Observable<string[]> {
    ++this.batchApiCalls;
    return of(texts.map(text => {
      if (text.includes('No-translate')) {
        return text;
      }
      if (text.startsWith('<')) {
        return text.replace(/<(\w+)(.*?)>(.*?)<\/\1>/g, '<$1$2>译$3</$1>');
      } else {
        return '[译]' + text;
      }
    })).pipe(delay(1000));
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

function translateByMsTranslator(texts: string[]): Observable<string[]> {
  const subscriptionKey = process.env.MS_TRANSLATOR;
  if (!subscriptionKey) {
    throw new Error('Environment variable for your subscription key is not set.');
  }

  return fromPromise(request({
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
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-type': 'application/json',
      'X-ClientTraceId': v4().toString(),
    },
    body: texts.map(text => ({
      'text': text,
    })),
    json: true,
  })).pipe(
    map((results) => results[0] as TranslationResult),
    map(result => result.translations.map(it => it.text)),
  );
}

function translateByGoogleCloud(texts: string[]): Observable<string[]> {
  const client = new v3.TranslationServiceClient();
  return from(client.translateText({
    parent: `projects/ralph-gde/locations/us-central1`,
    contents: texts,
    mimeType: 'text/html', // mime types: text/plain, text/html
    sourceLanguageCode: 'en',
    targetLanguageCode: 'zh-cn',
    model: 'projects/ralph-gde/locations/us-central1/models/TRL9199068616738092360',
  })).pipe(
    map(it => it[0]!.translations!.map(it => it.translatedText!!)),
  );
}
