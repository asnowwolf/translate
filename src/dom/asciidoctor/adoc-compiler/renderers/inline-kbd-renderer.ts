import { InlineNodeRenderer } from './inline-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;

interface InlineKbdAttributes {
  keys: string[];
}

export class InlineKbdRenderer extends InlineNodeRenderer<Inline> {
  render(node: Inline): string {
    const keys = (node.getAttributes() as InlineKbdAttributes).keys as string[];
    return `kbd:[${keys.join('+')}]`;
  }
}
