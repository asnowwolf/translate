import { AdocAttribute, AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface ExampleNode extends AdocNode {
}

export class ExampleRenderer extends BlockNodeRenderer<ExampleNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  protected getBlockAttributes(node: ExampleNode): AdocAttribute[] {
    const blockAttributes = super.getBlockAttributes(node);
    if (node.content_model === 'simple') {
      return blockAttributes;
    } else {
      return blockAttributes.filter(it => it.name !== 'style');
    }
  }

  renderBody(node: ExampleNode): string {
    const children = this.renderChildren(node);
    const delimiter = node.content_model === 'simple' ? '' : '====';
    return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
