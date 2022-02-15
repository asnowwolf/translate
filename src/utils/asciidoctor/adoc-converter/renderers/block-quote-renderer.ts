import { BlockNodeRenderer } from './block-node-renderer';
import { AdocAttribute, AdocNode } from './adoc-node';
import { needDelimiter } from './utils/need-delimiter';

interface BlockQuoteNode extends AdocNode {
}

export class BlockQuoteRenderer extends BlockNodeRenderer<BlockQuoteNode> {
  positionalAttributes = [{ name: 'style', position: 1 }, { name: 'attribution', position: 2 }, { name: 'citetitle', position: 3 }];

  protected getBlockAttributes(node: BlockQuoteNode): AdocAttribute[] {
    if (!needDelimiter(node)) {
      return [];
    } else {
      return this.getNonDefaultAttributes(node);
    }
  }

  protected renderBody(node: BlockQuoteNode): string {
    const children = this.renderChildren(node);
    if (!needDelimiter(node)) {
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
