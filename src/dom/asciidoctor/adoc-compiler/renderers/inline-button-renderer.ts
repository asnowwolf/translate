import { InlineNodeRenderer } from './inline-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;

export class InlineButtonRenderer extends InlineNodeRenderer<Inline> {
  render(node: Inline): string {
    return `btn:[${node.getText()}]`;
  }
}
