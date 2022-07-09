import { Extractor } from './extractor';
import { extname } from 'path';
import { MarkdownExtractor } from './markdown-extractor';

export function getExtractorFor(filename: string): Extractor {
  const ext = extname(filename);
  switch (ext) {
    case '.markdown':
    case '.md':
      return new MarkdownExtractor();
  }
}
