import { BlockNodeRenderer } from './block-node-renderer';
import { AbstractBlockNode } from '../dom/abstract-block-node';

export class PageBreakRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  renderBody(node: AbstractBlockNode): string {
    return `<<<`;
  }
}
