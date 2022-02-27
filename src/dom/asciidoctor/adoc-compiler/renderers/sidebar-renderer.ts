import { BlockNodeRenderer } from './block-node-renderer';
import { needDelimiter } from './utils/need-delimiter';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;
import AttributeEntry = Asciidoctor.Document.AttributeEntry;

export class SidebarRenderer extends BlockNodeRenderer<AbstractBlock> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  protected getBlockAttributes(node: AbstractBlock): AttributeEntry[] {
    const blockAttributes = super.getBlockAttributes(node);
    if (!needDelimiter(node)) {
      return blockAttributes;
    } else {
      return blockAttributes.filter(it => it.name !== 'style');
    }
  }

  renderBody(node: AbstractBlock): string {
    const children = this.renderChildren(node);
    const delimiter = !needDelimiter(node) ? '' : '****';
    return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n') + '\n';
  }
}
