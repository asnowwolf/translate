import { AbstractNode } from './dom/models';
import { BaseNodeRenderer } from './base-node-renderer';

export class FallbackRenderer extends BaseNodeRenderer<AbstractNode> {
  render(node: AbstractNode): string {
    console.warn(`Fallback renderer: ${node.getNodeName()}`);
    return '';
  }
}
