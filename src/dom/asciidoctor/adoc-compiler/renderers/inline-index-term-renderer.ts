import { addQuotes } from './utils/add-quotes';
import { InlineNodeRenderer } from './inline-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;
import InlineIndexTermAttributes = Asciidoctor.InlineIndexTermAttributes;

export class InlineIndexTermRenderer extends InlineNodeRenderer<Inline> {
  ignoredAttributeNames = ['terms'];

  render(node: Inline): string {
    const attributes = node.getAttributes() as InlineIndexTermAttributes;
    if (node.getText()) {
      return `((${node.getText()}))`;
    } else {
      return attributes.terms && `(((${attributes.terms.map(it => addQuotes(it)).join(',')})))`;
    }
  }
}
