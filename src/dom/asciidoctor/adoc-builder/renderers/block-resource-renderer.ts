import { BlockNodeRenderer } from './block-node-renderer';
import { InlineableAttribute } from './utils/inlineable-attributes';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;

export class BlockResourceRenderer extends BlockNodeRenderer<AbstractBlock> {
  constructor(private readonly type: string, internalAttributes: InlineableAttribute[]) {
    super();
    this.positionalAttributes = internalAttributes.filter((it => it.position));
    this.inlineAttributeNames = internalAttributes.map(it => it.name);
  }

  protected getBlockTitle(node: AbstractBlock): string {
    return node.getTitle();
  }

  renderBody(node: AbstractBlock): string {
    const attributes = this.renderAttributes(this.getInlineAttributes(node));
    return `${this.type}::${node.getAttribute('target')}[${attributes}]`;
  }
}
