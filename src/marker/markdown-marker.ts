import { Marker } from './marker';
import { Text } from 'mdast';
import * as unistVisit from 'unist-util-visit';
import { markdown } from '../dom/unified/markdown';

export class MarkdownMarker extends Marker {
  markContent(content: string) {
    const dom = markdown.parse(content);
    unistVisit(dom, 'text', (node: Text) => {
      node.value = node.value.replace(/\n/g, ' ');
    });
    return markdown.stringify(dom);
  }
}
