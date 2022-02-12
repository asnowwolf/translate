import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface PageBreakNode extends AdocNode {
}

export class PageBreakRenderer extends BlockNodeRenderer<PageBreakNode> {
  renderBody(node: PageBreakNode): string {
    return `<<<`;
  }
}
