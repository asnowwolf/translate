import { InlineNodeRenderer } from './inline-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;

interface InlineQuotedAttributes {
  role: string;
}

export class InlineQuotedRenderer extends InlineNodeRenderer<Inline> {
  render(node: Inline): string {
    const attributes = node.getAttributes() as InlineQuotedAttributes;
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
