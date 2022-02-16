import { InlineNode } from './dom/models';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineQuotedAttributes {
  role: string;
}

export class InlineQuotedRenderer extends InlineNodeRenderer<InlineNode> {
  render(node: InlineNode): string {
    const attributes = node.getAttributes<InlineQuotedAttributes>();
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
