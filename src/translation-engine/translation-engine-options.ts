import { Dict } from '../dict/dict';

export interface TranslationEngineOptions {
  dict?: string | Dict;
  parent?: string;
  model?: string;
  glossary?: string;
}
