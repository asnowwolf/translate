import { BlockNodeRenderer } from './block-node-renderer';
import { AbstractBlockNode } from '../dom/abstract-block-node';

export class ThematicBreakRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  renderBody(node: AbstractBlockNode): string {
    return `'''`;
  }
}
