import { AbstractBlockNode } from './dom/models';
import { BlockNodeRenderer } from './block-node-renderer';
import { InlineableAttribute } from './utils/inlineable-attributes';

export class BlockResourceRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  constructor(private readonly type: string, internalAttributes: InlineableAttribute[]) {
    super();
    this.positionalAttributes = internalAttributes.filter((it => it.position));
    this.inlineAttributeNames = internalAttributes.map(it => it.name);
  }

  protected getBlockTitle(node: AbstractBlockNode): string {
    return node.getTitle();
  }

  renderBody(node: AbstractBlockNode): string {
    const attributes = this.renderAttributes(this.getInlineAttributes(node));
    return `${this.type}::${node.getAttribute('target')}[${attributes}]`;
  }
}
