import { NodeRenderer } from './node-renderer';
import { AdocNode } from './adoc-node';

interface InlineNode extends AdocNode {

}

export class InlineNodeRenderer<T extends AdocNode> implements NodeRenderer<T> {
  render(node: InlineNode): string {
    return node.getText();
  }
}
