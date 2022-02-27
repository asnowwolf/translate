import { InlineNodeRenderer } from './inline-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;

export class InlineCalloutRenderer extends InlineNodeRenderer<Inline> {
  render(node: Inline): string {
    return `<${node.getText()}>`;
  }
}
