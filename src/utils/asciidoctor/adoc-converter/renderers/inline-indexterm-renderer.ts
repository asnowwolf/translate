import { BlockNodeRenderer } from './block-node-renderer';
import { addQuotes } from './utils/add-quotes';
import { AdocNode } from './adoc-node';

interface InlineIndexTermNode extends AdocNode {
  getAttributes(): { terms: string[] };
}

export class InlineIndextermRenderer extends BlockNodeRenderer<InlineIndexTermNode> {
  ignoredAttributes = ['terms'];

  renderBody(node: InlineIndexTermNode): string {
    const attributes = node.getAttributes();
    if (node.getText()) {
      return `((${node.getText()}))`;
    } else {
      return attributes.terms && `(((${attributes.terms.map(it => addQuotes(it)).join(', ')})))`;
    }
  }
}
