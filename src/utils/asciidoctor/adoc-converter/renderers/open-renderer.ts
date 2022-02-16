import { BlockNodeRenderer } from './block-node-renderer';
import { AbstractBlockNode } from './dom/models';

export class OpenRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  render(node: AbstractBlockNode): string {
    const delimiter = '--';
    return [delimiter, this.renderChildren(node).trim(), delimiter].join('\n');
  }
}
