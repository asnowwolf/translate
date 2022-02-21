import { InlineNodeRenderer } from './inline-node-renderer';
import { InlineNode } from '../dom/inline-node';

export class InlineButtonRenderer extends InlineNodeRenderer<InlineNode> {
  render(node: InlineNode): string {
    return `btn:[${node.getText()}]`;
  }
}
