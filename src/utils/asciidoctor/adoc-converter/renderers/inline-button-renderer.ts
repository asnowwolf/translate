import { InlineNode } from './dom/models';
import { InlineNodeRenderer } from './inline-node-renderer';

export class InlineButtonRenderer extends InlineNodeRenderer<InlineNode> {
  render(node: InlineNode): string {
    return `btn:[${node.getText()}]`;
  }
}
