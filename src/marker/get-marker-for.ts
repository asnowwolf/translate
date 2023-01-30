import { extname } from 'path';
import { HtmlMarker } from './html-marker';
import { Marker } from './marker';
import { AngularJsonMarker } from './angular-json-marker';
import { SubtitleMarker } from './subtitle-marker';
import { MarkdownMarker } from './markdown-marker';

export function getMarkerFor(filename: string): Marker {
  const ext = extname(filename);
  switch (ext) {
    case '.html':
      return new HtmlMarker();
    case '.md':
    case '.markdown':
      return new MarkdownMarker();
    case '.json':
      return new AngularJsonMarker();
    case '.vtt':
    case '.srt':
      return new SubtitleMarker();
  }
}
