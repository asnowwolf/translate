import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineQuotedNode extends AdocNode {

}

export class InlineQuotedRenderer extends InlineNodeRenderer<InlineQuotedNode> {
  render(node: InlineQuotedNode): string {
    const attributes = node.getAttributes();
    const role = attributes.role;
    const quote = quotes[node.getType()];
    return [
      role && `[.${role}]`,
      quote,
      node.getText(),
      quote,
    ].filter(it => !!it).join('');
  }
}

const quotes = {
  'strong': '*',
  'monospaced': '`',
  'emphasis': '_',
  'mark': '#',
  'superscript': '^',
  'subscript': '~',
  'unquoted': '#',
};
