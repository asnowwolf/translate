import { extname } from 'path';
import { HtmlExporter } from './html-exporter';
import { Exporter } from './exporter';
import { AngularJsonExporter } from './angular-json-exporter';
import { SubtitleExporter } from './subtitle-exporter';
import { MarkdownExporter } from './markdown-exporter';

export function getExporterFor(filename: string): Exporter {
  const ext = extname(filename);
  switch (ext) {
    case '.html':
      return new HtmlExporter();
    case '.md':
    case '.markdown':
      return new MarkdownExporter();
    case '.json':
      return new AngularJsonExporter();
    case '.vtt':
    case '.srt':
      return new SubtitleExporter();
  }
}
