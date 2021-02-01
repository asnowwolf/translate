import { Dict } from '../dict/dict';

export interface TranslationEngineOptions {
  dict?: Dict;
  parent?: string;
  model?: string;
  glossary?: string;
}
