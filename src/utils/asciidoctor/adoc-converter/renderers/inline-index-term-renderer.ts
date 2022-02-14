import { addQuotes } from './utils/add-quotes';
import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineIndexTermNode extends AdocNode {
  getAttributes(): { terms: string[] };
}

export class InlineIndexTermRenderer extends InlineNodeRenderer<InlineIndexTermNode> {
  ignoredAttributeNames = ['terms'];

  render(node: InlineIndexTermNode): string {
    const attributes = node.getAttributes();
    if (node.getText()) {
      return `((${node.getText()}))`;
    } else {
      return attributes.terms && `(((${attributes.terms.map(it => addQuotes(it)).join(', ')})))`;
    }
  }
}
