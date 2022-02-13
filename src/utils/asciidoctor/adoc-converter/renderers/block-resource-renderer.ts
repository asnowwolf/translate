import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';
import { InternalAttribute } from './utils/internal-attributes';

interface BlockResourceNode extends AdocNode {

}

export class BlockResourceRenderer extends BlockNodeRenderer<BlockResourceNode> {
  constructor(private readonly type: string, internalAttributes: InternalAttribute[]) {
    super();
    this.internalAttributes = internalAttributes;
  }

  ignoredAttributes = ['target', 'attribute_entries', ...this.internalAttributes.map(it => it.name)];

  protected getBlockTitle(node: BlockResourceNode): string {
    return node.getTitle();
  }

  renderBody(node: BlockResourceNode): string {
    const attributes = this.renderAttributes(this.getInternalAttributes(node));
    return `${this.type}::${node.getAttribute('target')}[${attributes}]`;
  }
}
