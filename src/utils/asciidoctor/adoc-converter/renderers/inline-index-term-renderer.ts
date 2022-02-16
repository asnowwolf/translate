import { addQuotes } from './utils/add-quotes';
import { InlineNode } from './dom/models';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineIndexTermAttributes {
  terms: string[];
}

export class InlineIndexTermRenderer extends InlineNodeRenderer<InlineNode> {
  ignoredAttributeNames = ['terms'];

  render(node: InlineNode): string {
    const attributes = node.getAttributes<InlineIndexTermAttributes>();
    if (node.getText()) {
      return `((${node.getText()}))`;
    } else {
      return attributes.terms && `(((${attributes.terms.map(it => addQuotes(it)).join(', ')})))`;
    }
  }
}
