import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

export class FallbackRenderer extends BlockNodeRenderer<AdocNode> {
  render(node: AdocNode): string {
    console.warn(`Fallback renderer: ${node.getNodeName()}`);
    return '';
  }
}
