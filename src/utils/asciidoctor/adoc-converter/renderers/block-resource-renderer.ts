import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';
import { InlineableAttribute } from './utils/inlineable-attributes';

interface BlockResourceNode extends AdocNode {

}

export class BlockResourceRenderer extends BlockNodeRenderer<BlockResourceNode> {
  constructor(private readonly type: string, internalAttributes: InlineableAttribute[]) {
    super();
    this.positionalAttributes = internalAttributes.filter((it => it.position));
    this.inlineAttributeNames = internalAttributes.map(it => it.name);
  }

  protected getBlockTitle(node: BlockResourceNode): string {
    return node.getTitle();
  }

  renderBody(node: BlockResourceNode): string {
    const attributes = this.renderAttributes(this.getInlineAttributes(node));
    return `${this.type}::${node.getAttribute('target')}[${attributes}]`;
  }
}
