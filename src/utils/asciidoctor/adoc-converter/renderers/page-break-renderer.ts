import { AdocNode, BlockNodeRenderer } from './block-node-renderer';

interface PageBreakNode extends AdocNode {
}

export class PageBreakRenderer extends BlockNodeRenderer<PageBreakNode> {
  renderBody(node: PageBreakNode): string {
    return `<<<`;
  }
}
