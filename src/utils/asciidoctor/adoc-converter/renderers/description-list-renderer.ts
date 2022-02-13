import { BlockNodeRenderer } from './block-node-renderer';
import { ListItemNode } from './list-item-renderer';
import { AdocNode } from './adoc-node';

interface DescriptionListNode extends AdocNode {
  getItems(): [[ListItemNode], ListItemNode][];
}

export class DescriptionListRenderer extends BlockNodeRenderer<DescriptionListNode> {
  renderChildren(node: DescriptionListNode): string {
    const items = node.getItems();
    return items.map(([[term], description]) => [
        term.convert(),
        '::',
        description.getBlocks().length > 0 ? '\n' : ' ',
        description.convert(),
      ].join(''),
    ).join('\n');
  }
}
