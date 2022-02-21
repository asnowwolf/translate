import { BlockNodeRenderer } from './block-node-renderer';
import { AbstractBlockNode } from '../dom/abstract-block-node';
import { AttributeEntry } from '../dom/document-node';

export class ExampleRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  protected getBlockAttributes(node: AbstractBlockNode): AttributeEntry[] {
    const blockAttributes = super.getBlockAttributes(node);
    if (node.content_model === 'simple') {
      return blockAttributes;
    } else {
      return blockAttributes.filter(it => it.name !== 'style');
    }
  }

  renderBody(node: AbstractBlockNode): string {
    const children = this.renderChildren(node);
    const delimiter = node.content_model === 'simple' ? '' : '====';
    return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
