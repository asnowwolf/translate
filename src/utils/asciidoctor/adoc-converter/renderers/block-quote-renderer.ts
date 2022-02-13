import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface BlockQuoteNode extends AdocNode {
}

export class BlockQuoteRenderer extends BlockNodeRenderer<BlockQuoteNode> {
  ignoredAttributes = ['attribution', 'citetitle'];

  protected renderBody(node: BlockQuoteNode): string {
    const children = this.renderChildren(node);
    if (node.content_model === 'simple') {
      const attribution = node.getAttributes().attribution;
      const citetitle = node.getAttributes().citetitle;
      return `"${children}"\n-- ${[attribution, citetitle].filter(Boolean).join(', ')}`;
    } else {
      const delimiter = '____';
      return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
    }
  }
}
