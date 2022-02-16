import { BlockNodeRenderer } from './block-node-renderer';
import { AbstractBlockNode } from './dom/models';

export class PageBreakRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  renderBody(node: AbstractBlockNode): string {
    return `<<<`;
  }
}
