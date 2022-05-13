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

  protected getDefaultAttributes(node: Asciidoctor.AbstractBlock): { [p: string]: any } {
    const hasAnotherPositionalAttribute = this.positionalAttributes.some(it => it.name !== 'style' && node.hasAttribute(it.name));
    if (!isQuote(node) || hasAnotherPositionalAttribute) {
      return {};
    } else {
      return { style: 'quote' };
    }
  }

  protected getBlockAttributes(node: AbstractBlock): AttributeEntry[] {
    if (isQuote(node) && !needDelimiter(node)) {
      return [];
    } else {
      return this.getNonDefaultAttributes(node);
    }
  }

  protected renderBody(node: AbstractBlock): string {
    const children = this.renderChildren(node);
    if (isQuote(node) && !needDelimiter(node)) {
      const attributes = node.getAttributes() as BlockQuoteAttributes;
      const attribution = attributes.attribution;
      const citetitle = attributes.citetitle;
      return `"${children}"\n-- ${[attribution, citetitle].filter(it => !!it).join(', ')}`;
    } else {
      const delimiter = needDelimiter(node) ? '____' : '';
      return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
    }
  }
}

function isQuote(node: Asciidoctor.AbstractBlock): boolean {
  return node.getStyle() === 'quote';
}
