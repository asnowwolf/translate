import { TranslationEngineType } from '../common';
import { GoogleTranslationEngine } from './google-engine';
import { GoogleCloudTranslationEngine } from './gcloud-engine';
import { MsTranslationEngine } from './ms-engine';
import { DictTranslationEngine } from './dict-engine';
import { FakeTranslationEngine } from './fake-engine';
import { NoopTranslationEngine } from './noop-engine';
import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';

export function getTranslationEngine(engine: TranslationEngineType, options: TranslationEngineOptions): TranslationEngine {
  switch (engine) {
    case TranslationEngineType.google:
      return new GoogleTranslationEngine();
    case TranslationEngineType.gcloud:
      return new GoogleCloudTranslationEngine(options);
    case TranslationEngineType.ms:
      return new MsTranslationEngine();
    case TranslationEngineType.dict:
      return new DictTranslationEngine(options);
    case TranslationEngineType.fake:
      return new FakeTranslationEngine();
    case TranslationEngineType.noop:
      return new NoopTranslationEngine();
    default:
      throw new Error('Unknown Translation Engine type');
  }
}
