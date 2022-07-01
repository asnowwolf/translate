import { TranslationEngine } from '../translation-engine/translation-engine';
import { AbstractTranslator } from './abstract-translator';
import { extname } from 'path';
import { HtmlTranslator } from './html-translator';
import { MarkdownTranslator } from './markdown-translator';
import { JsdocTranslator } from './jsdoc-translator';
import { DbTranslator } from './db-translator';
import { JsonTranslator } from './json-translator';
import { AdocTranslator } from './adoc-translator';

export function getTranslator(filename: string, engine: TranslationEngine, options: Record<string, any> = {}): AbstractTranslator<any> {
  const extension = extname(filename);
  switch (extension) {
    case '.sqlite':
      return new DbTranslator(engine);
    case '.html':
    case '.htm':
      return new HtmlTranslator(engine);
    case '.md':
    case '.markdown':
      return new MarkdownTranslator(engine);
    case '.js':
    case '.ts':
    case '.jsx':
    case '.tsx':
      return new JsdocTranslator(engine);
    case '.json':
      return new JsonTranslator(engine);
    case '.adoc':
      return new AdocTranslator(engine);
    default:
      throw new Error(`不支持的文件类型: ${extension}`);
  }
}
