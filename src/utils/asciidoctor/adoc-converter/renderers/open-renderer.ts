import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface OpenNode extends AdocNode {
}

export class OpenRenderer extends BlockNodeRenderer<OpenNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  render(node: OpenNode): string {
    const delimiter = '--';
    return [delimiter, this.renderChildren(node).trim(), delimiter].join('\n');
  }
}
