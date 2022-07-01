import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import DescriptionList = Asciidoctor.DescriptionList;

export class DescriptionListRenderer extends BlockNodeRenderer<DescriptionList> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  protected getBlockTitle(node: DescriptionList): string {
    return node.getTitle();
  }

  renderChildren(node: DescriptionList): string {
    const items = node.getItems();
    return items.map(([[term], description]) => [
        term.convert(),
        '::',
        description.getBlocks().length > 0 ? '\n' : ' ',
        description.convert(),
      ].join(''),
    ).join('\n').trim();
  }
}
