import { GoogleTranslationEngine } from './google-engine';
import { DictTranslationEngine } from './dict-engine';
import { FakeTranslationEngine } from './fake-engine';
import { NormalizeTranslationEngine } from './normalize-engine';
import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { TranslationEngineType } from './translation-engine-type';
import { ExtractorEngine } from './extractor-engine';
import { VectorizerEngine } from './vectorizer-engine';

export function getTranslationEngine(engine: TranslationEngineType, options: TranslationEngineOptions = {}): TranslationEngine {
  switch (engine) {
    case TranslationEngineType.google:
      return new GoogleTranslationEngine();
    case TranslationEngineType.dict:
      return new DictTranslationEngine(options);
    case TranslationEngineType.fake:
      return new FakeTranslationEngine();
    case TranslationEngineType.normalizer:
      return new NormalizeTranslationEngine();
    case TranslationEngineType.extractor:
      return new ExtractorEngine(options);
    case TranslationEngineType.vectorizer:
      return new VectorizerEngine(options);
    default:
      throw new Error('Unknown Translation Engine type');
  }
}
