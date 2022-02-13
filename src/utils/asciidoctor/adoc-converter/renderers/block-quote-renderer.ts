import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface BlockQuoteNode extends AdocNode {
}

export class BlockQuoteRenderer extends BlockNodeRenderer<BlockQuoteNode> {
  ignoredAttributes = ['style', 'attribution', 'citetitle'];

  protected renderBody(node: BlockQuoteNode): string {
    const children = this.renderChildren(node);
    if (node.content_model === 'simple' && !node.getTitle()) {
      const attribution = node.getAttributes().attribution;
      const citetitle = node.getAttributes().citetitle;
      return `"${children}"\n-- ${[attribution, citetitle].filter(Boolean).join(', ')}`;
    } else {
      const delimiter = isMultiBlock(node) || isTopLevel(node) ? '____' : '';
      return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
    }
  }
}

function isTopLevel(node: BlockQuoteNode) {
  return node.getParent().getNodeName() !== 'document';
}

function isMultiBlock(node: BlockQuoteNode) {
  return node.getBlocks().length > 1;
}
