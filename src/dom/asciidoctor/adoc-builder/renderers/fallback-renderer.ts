import { BaseNodeRenderer } from './base-node-renderer';
import { AbstractNode } from '../dom/abstract-node';

export class FallbackRenderer extends BaseNodeRenderer<AbstractNode> {
  render(node: AbstractNode): string {
    console.warn(`Fallback renderer: ${node.getNodeName()}`);
    return '';
  }
}
