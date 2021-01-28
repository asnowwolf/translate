import { TranslationEngine } from '../translation-engine/translation-engine';
import { Translator } from './translator';
import { extname } from 'path';
import { HtmlTranslator } from './html-translator';
import { MarkdownTranslator } from './markdown-translator';
import { JsdocTranslator } from './jsdoc-translator';

export function getTranslator(filename: string, engine: TranslationEngine): Translator {
  const extension = extname(filename);
  switch (extension) {
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
    default:
      throw new Error(`不支持的文件类型: ${extension}`);
  }
}
