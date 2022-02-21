import { InlineNodeRenderer } from './inline-node-renderer';
import { InlineNode } from '../dom/inline-node';

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
