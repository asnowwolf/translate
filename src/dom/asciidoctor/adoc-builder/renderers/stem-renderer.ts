import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;
import AbstractNode = Asciidoctor.AbstractNode;

export class StemRenderer extends BlockNodeRenderer<AbstractBlock> {
  protected getDefaultAttributes(node: AbstractNode): { [p: string]: any } {
    return { style: 'asciimath' };
  }

  protected renderBody(node: AbstractBlock): string {
    const delimiter = '++++';
    return [delimiter, node.getContent(), delimiter].join('\n');
  }
}
