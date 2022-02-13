import { BaseNodeRenderer } from './base-node-renderer';
import { AdocNode } from './adoc-node';

interface InlineNode extends AdocNode {

}

export class InlineNodeRenderer<T extends AdocNode> extends BaseNodeRenderer<T> {
  render(node: InlineNode): string {
    return node.getText();
  }
}
