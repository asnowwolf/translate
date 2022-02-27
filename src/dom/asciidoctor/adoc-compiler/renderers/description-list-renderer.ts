import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import List = Asciidoctor.List;
import ListItem = Asciidoctor.ListItem;

type DescriptionItem = [[ListItem], ListItem];

export class DescriptionListRenderer extends BlockNodeRenderer<List> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  renderChildren(node: List): string {
    const items = node.getItems() as unknown as DescriptionItem[];
    return items.map(([[term], description]) => [
      term.convert(),
        '::',
        description.getBlocks().length > 0 ? '\n' : ' ',
        description.convert(),
      ].join(''),
    ).join('\n');
  }
}
