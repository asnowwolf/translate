import { Extractor } from './extractor';
import { HtmlExtractor } from './html-extractor';
import { extname } from 'path';
import { MarkdownExtractor } from './markdown-extractor';
import { JsonExtractor } from './json-extractor';
import { JsDocExtractor } from './js-doc-extractor';

export function getExtractorFor(filename: string): Extractor {
  const ext = extname(filename);
  switch (ext) {
    case '.html':
      return new HtmlExtractor();
    case '.md':
      return new MarkdownExtractor();
    case '.json':
      return new JsonExtractor();
    case '.ts':
      return new JsDocExtractor();
  }
}
