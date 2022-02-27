import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;

export class OpenRenderer extends BlockNodeRenderer<AbstractBlock> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  render(node: AbstractBlock): string {
    const delimiter = '--';
    return [delimiter, this.renderChildren(node).trim(), delimiter].join('\n');
  }
}
