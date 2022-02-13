import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineButtonNode extends AdocNode {
}

export class InlineButtonRenderer extends InlineNodeRenderer<InlineButtonNode> {
  render(node: InlineButtonNode): string {
    return `btn:[${node.getText()}]`;
  }
}
