import { AdocNode, BlockNodeRenderer } from './block-node-renderer';

interface ThematicBreakNode extends AdocNode {
}

export class ThematicBreakRenderer extends BlockNodeRenderer<ThematicBreakNode> {
  renderBody(node: ThematicBreakNode): string {
    return `'''`;
  }
}
