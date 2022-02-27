import { BlockNodeRenderer } from './block-node-renderer';
import { needDelimiter } from './utils/need-delimiter';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;
import AttributeEntry = Asciidoctor.Document.AttributeEntry;

interface BlockQuoteAttributes {
  attribution: string;
  citetitle: string;
}

export class BlockQuoteRenderer extends BlockNodeRenderer<AbstractBlock> {
  positionalAttributes = [{ name: 'style', position: 1 }, { name: 'attribution', position: 2 }, { name: 'citetitle', position: 3 }];

  protected getBlockAttributes(node: AbstractBlock): AttributeEntry[] {
    if (!needDelimiter(node)) {
      return [];
    } else {
      return this.getNonDefaultAttributes(node);
    }
  }

  protected renderBody(node: AbstractBlock): string {
    const children = this.renderChildren(node);
    if (!needDelimiter(node)) {
      const attributes = node.getAttributes() as BlockQuoteAttributes;
      const attribution = attributes.attribution;
      const citetitle = attributes.citetitle;
      return `"${children}"\n-- ${[attribution, citetitle].filter(it => !!it).join(', ')}`;
    } else {
      const delimiter = isMultiBlock(node) || isTopLevel(node) ? '____' : '';
      return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
    }
  }
}

function isTopLevel(node: AbstractBlock) {
  return node.getParent().getNodeName() !== 'document';
}

function isMultiBlock(node: AbstractBlock) {
  return node.getBlocks().length > 1;
}
