import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Block = Asciidoctor.Block;

export class ParagraphRenderer extends BlockNodeRenderer<Block> {
  protected renderChildren(node: Block): string {
    return node.getContent();
  }
}
