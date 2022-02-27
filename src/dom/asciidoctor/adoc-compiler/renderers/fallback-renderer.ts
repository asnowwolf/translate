import { BaseNodeRenderer } from './base-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractNode = Asciidoctor.AbstractNode;

export class FallbackRenderer extends BaseNodeRenderer<AbstractNode> {
  render(node: AbstractNode): string {
    console.warn(`Fallback renderer: ${node.getNodeName()}`);
    return '';
  }
}
