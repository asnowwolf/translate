import { BlockNodeRenderer } from './block-node-renderer';
import { needDelimiter } from './utils/need-delimiter';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;
import AttributeEntry = Asciidoctor.Document.AttributeEntry;

export class AdmonitionRenderer extends BlockNodeRenderer<AbstractBlock> {
  positionalAttributes = [{ name: 'style', position: 1 }];
  ignoredAttributeNames = ['name', 'textlabel'];

  renderBody(node: AbstractBlock): string {
    const children = this.renderChildren(node);
    const prefix = !needDelimiter(node) ? `${node.getStyle()}: ` : '';
    const delimiter = !needDelimiter(node) ? '' : '====';
    return [delimiter, prefix + children.trim(), delimiter].filter(it => !!it).join('\n') + '\n';
  }

  protected getBlockAttributes(node: AbstractBlock): AttributeEntry[] {
    return super.getBlockAttributes(node).filter(it => !isDefaultValue(it, node));
  }
}

function isDefaultValue(it: AttributeEntry, node: AbstractBlock) {
  return it.name === 'style' && !needDelimiter(node) && it.value.toString().toLowerCase() === node.getStyle()?.toLowerCase();
}
