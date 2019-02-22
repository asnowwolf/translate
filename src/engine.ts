import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import * as request from 'request-promise-native';
import { v4 } from 'uuid';
import { map } from 'rxjs/operators';
import { PredictionServiceClient } from '@google-cloud/automl';
import { TranslationEngineType } from './common';

export abstract class TranslationEngine {
  abstract translate(text: string): Observable<string>;
}

export function getTranslateEngine(engine: TranslationEngineType): TranslationEngine {
  switch (engine) {
    case TranslationEngineType.google:
      return new GoogleTranslator();
    case TranslationEngineType.ms:
      return new MsTranslator();
    case TranslationEngineType.fake:
      return new FakeTranslator();
    default:
      throw new Error('Unknown Translation Engine type');
  }
}

class MsTranslator extends TranslationEngine {
  translate(text: string): Observable<string> {
    return translateByMsTranslator(text);
  }
}

class GoogleTranslator extends TranslationEngine {
  translate(text: string): Observable<string> {
    return translateByGoogleAutoML(text);
  }
}

class FakeTranslator extends TranslationEngine {
  translate(text: string): Observable<string> {
    if (text.startsWith('<')) {
      return of(text.replace(/<(\w+)(.*?)>(.*?)<\/\1>/g, '<$1$2>译$3</$1>'));
    } else {
      return of('[译]' + text);
    }
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

function translateByMsTranslator(text: string): Observable<string> {
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
    body: [{
      'text': text,
    }],
    json: true,
  })).pipe(
    map((results) => results[0] as TranslationResult),
    map(result => result.translations[0].text),
  );
}

function translateByGoogleAutoML(text: string): Observable<string> {
  const client = new PredictionServiceClient();

  const formattedName = client.modelPath('ralph-gde', 'us-central1', 'TRL9199068616738092360');
  const payload = {
    textSnippet: {
      content: text,
      mimeType: `text/html`,
    },
  };
  const request = {
    name: formattedName,
    payload: payload,
  };
  return fromPromise(client.predict(request).then((responses: AutoMLResponse[]) => {
    return responses[0].payload[0].translation.translatedContent.content;
  }));
}

interface AutoMLResponse {
  metadata: Record<string, string>;
  payload: AutoMLResponsePayload[];
}

interface AutoMLResponsePayload {
  annotationSpecId: string;
  detail: string;
  displayName: string;
  translation: AutoMLTranslation;
}

interface AutoMLTranslation {
  translatedContent: AutoMLTranslationContent;
}

interface AutoMLTranslationContent {
  content: string;
  contentUri: string;
  mimeType: string;
}
