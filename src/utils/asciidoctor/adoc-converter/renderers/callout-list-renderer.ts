import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface CalloutListNode extends AdocNode {
}

export class CalloutListRenderer extends BlockNodeRenderer<CalloutListNode> {
  render(node: CalloutListNode): string {
    return node.getBlocks().map(it => it.convert()).join('\n');
  }
}
