import { AdocAttribute, AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';
import { internalImageAttributes } from './utils/internal-image-attributes';

interface BlockImageNode extends AdocNode {

}

export class BlockImageRenderer extends BlockNodeRenderer<BlockImageNode> {
  ignoredAttributes = ['target', 'attribute_entries', ...internalImageAttributes];

  protected getBlockTitle(node: BlockImageNode): string {
    return node.getTitle();
  }

  renderBody(node: BlockImageNode): string {
    const attributes = this.getAttributes(node);
    const innerAttributes = attributes
      .filter(it => !!it)
      .filter(({ name }) => internalImageAttributes.includes(name))
      .map((attr: AdocAttribute) => this.renderAttribute(attr));
    const content = innerAttributes.filter(it => !!it).join(',');
    return `image::${node.getAttribute('target')}[${content}]`;
  }
}
