import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface ThematicBreakNode extends AdocNode {
}

export class ThematicBreakRenderer extends BlockNodeRenderer<ThematicBreakNode> {
  renderBody(node: ThematicBreakNode): string {
    return `'''`;
  }
}
