import { AbstractNode } from '../../utils/adoc-node-renderer';
import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';

export class TinyFallbackRenderer extends BaseTinyNodeRenderer<AbstractNode> {
  render(node: AbstractNode): string {
    throw new Error(`Unknown node type: ${node.getNodeName()}`);
  }
}
