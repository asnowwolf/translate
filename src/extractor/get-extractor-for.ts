import { Extractor } from './extractor';
import { HtmlExtractor } from './html-extractor';
import { extname } from 'path';
import { MarkdownExtractor } from './markdown-extractor';
import { AdocExtractor } from './adoc-extractor';
import { AngularJsonExtractor } from './angular-json-extractor';

export function getExtractorFor(filename: string): Extractor {
  const ext = extname(filename);
  switch (ext) {
    case '.html':
      return new HtmlExtractor();
    case '.md':
      return new MarkdownExtractor();
    case '.adoc':
    case '.asciidoc':
      return new AdocExtractor();
    case '.json':
      return new AngularJsonExtractor();
  }
}
