import { defer, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import * as request from 'request-promise-native';
import { v4 } from 'uuid';
import { map } from 'rxjs/operators';

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

function translateUsingMsTranslator(text: string): Observable<string> {
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

export function translate(text: string): Observable<string> {
  return defer(() => translateUsingMsTranslator(text));
}

const subscriptionKey = process.env.MS_TRANSLATOR;
if (!subscriptionKey) {
  throw new Error('Environment variable for your subscription key is not set.');
}
