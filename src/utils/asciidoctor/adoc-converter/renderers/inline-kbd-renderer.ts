import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineKbdNode extends AdocNode {
  getAttributes(): { keys: string[] };
}

export class InlineKbdRenderer extends InlineNodeRenderer<InlineKbdNode> {
  render(node: InlineKbdNode): string {
    const keys = node.getAttributes().keys;
    return `kbd:[${keys.join('+')}]`;
  }
}
