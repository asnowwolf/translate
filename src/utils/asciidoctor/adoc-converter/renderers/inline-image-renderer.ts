import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';
import { addQuotes } from './utils/add-quotes';

interface InlineImageNode extends AdocNode {
  getTarget(): string;
}

export class InlineImageRenderer extends InlineNodeRenderer<InlineImageNode> {
  render(node: InlineImageNode): string {
    const attributes = node.getAttributes();
    const title = attributes.title ?? attributes.alt;
    if (title === attributes['default-alt']) {
      return `image:${node.getTarget()}[]`;
    } else {
      return `image:${node.getTarget()}[${addQuotes(title)}]`;
    }
  }
}
