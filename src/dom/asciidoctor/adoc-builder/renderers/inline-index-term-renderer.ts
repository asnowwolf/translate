import { addQuotes } from './utils/add-quotes';
import { InlineNodeRenderer } from './inline-node-renderer';
import { InlineNode } from '../dom/inline-node';

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
      return attributes.terms && `(((${attributes.terms.map(it => addQuotes(it)).join(',')})))`;
    }
  }
}
