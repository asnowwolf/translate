import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;

export class ThematicBreakRenderer extends BlockNodeRenderer<AbstractBlock> {
  renderBody(node: AbstractBlock): string {
    return `'''`;
  }
}
