import { InlineNodeRenderer } from './inline-node-renderer';
import { InlineNode } from './dom/models';

interface InlineKbdAttributes {
  keys: string[];
}

export class InlineKbdRenderer extends InlineNodeRenderer<InlineNode> {
  render(node: InlineNode): string {
    const keys = node.getAttributes<InlineKbdAttributes>().keys as string[];
    return `kbd:[${keys.join('+')}]`;
  }
}
