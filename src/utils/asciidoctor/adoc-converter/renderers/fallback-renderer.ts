import { AdocNode, BlockNodeRenderer } from './block-node-renderer';

export class FallbackRenderer extends BlockNodeRenderer<AdocNode> {
  render(node: AdocNode): string {
    console.warn(`Fallback renderer: ${node.getNodeName()}`);
    return '';
  }
}
