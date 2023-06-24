import { TranslationEngineType } from '../translation-engine/translation-engine-type';

export interface TranslationOptions {
  engine?: TranslationEngineType;
  filename?: string;
  htmlFragment?: boolean;
  mustIncludesTags?: string[];
  mustExcludesTags?: string[];
  jsonProperties?: string[];
}
