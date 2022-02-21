import { BlockNodeRenderer } from './block-node-renderer';
import { needDelimiter } from './utils/need-delimiter';
import { AbstractBlockNode } from '../dom/abstract-block-node';
import { AttributeEntry } from '../dom/document-node';

interface BlockQuoteAttributes {
  attribution: string;
  citetitle: string;
}

export class BlockQuoteRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  positionalAttributes = [{ name: 'style', position: 1 }, { name: 'attribution', position: 2 }, { name: 'citetitle', position: 3 }];

  protected getBlockAttributes(node: AbstractBlockNode): AttributeEntry[] {
    if (!needDelimiter(node)) {
      return [];
    } else {
      return this.getNonDefaultAttributes(node);
    }
  }

  protected renderBody(node: AbstractBlockNode): string {
    const children = this.renderChildren(node);
    if (!needDelimiter(node)) {
      const attributes = node.getAttributes<BlockQuoteAttributes>();
      const attribution = attributes.attribution;
      const citetitle = attributes.citetitle;
      return `"${children}"\n-- ${[attribution, citetitle].filter(it => !!it).join(', ')}`;
    } else {
      const delimiter = isMultiBlock(node) || isTopLevel(node) ? '____' : '';
      return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
    }
  }
}

function isTopLevel(node: AbstractBlockNode) {
  return node.getParent().getNodeName() !== 'document';
}

function isMultiBlock(node: AbstractBlockNode) {
  return node.getBlocks().length > 1;
}
