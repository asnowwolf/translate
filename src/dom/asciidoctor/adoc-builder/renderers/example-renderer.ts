import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import { needDelimiter } from './utils/need-delimiter';
import AbstractBlock = Asciidoctor.AbstractBlock;
import AttributeEntry = Asciidoctor.Document.AttributeEntry;

export class ExampleRenderer extends BlockNodeRenderer<AbstractBlock> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  protected getBlockAttributes(node: AbstractBlock): AttributeEntry[] {
    const blockAttributes = super.getBlockAttributes(node);
    // 如果有分隔符，解析器就能直接判断出来 style 是 example，所以可以省略 style
    if (needDelimiter(node)) {
      return blockAttributes.filter(it => it.name !== 'style');
    } else {
      return blockAttributes;
    }
  }

  renderBody(node: AbstractBlock): string {
    const children = this.renderChildren(node);
    const delimiter = needDelimiter(node) ? '====' : '';
    return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
