import { TranslationEngine } from '../engines/translation-engine';
import { FileTranslator } from './file-translator';
import { extname } from 'path';
import { HtmlTranslator } from './html-translator';
import { MarkdownTranslator } from './markdown-translator';
import { JsdocTranslator } from './jsdoc-translator';

export function getTranslator(filename: string, engine: TranslationEngine): FileTranslator {
  const extension = extname(filename);
  switch (extension) {
    case '.html':
    case '.htm':
      return new HtmlTranslator(filename, engine);
    case '.md':
    case '.markdown':
      return new MarkdownTranslator(filename, engine);
    case '.js':
    case '.ts':
    case '.jsx':
    case '.tsx':
      return new JsdocTranslator(filename, engine);
    default:
      throw new Error(`不支持的文件类型: ${extension}`);
  }
}
