import { BlockNodeRenderer } from './block-node-renderer';
import { AbstractBlockNode } from '../dom/abstract-block-node';

export class PreambleRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  renderBody(node: AbstractBlockNode): string {
    return node.getContent();
  }
}
