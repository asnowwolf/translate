import { BlockNodeRenderer } from './block-node-renderer';
import { ListItemNode, ListNode } from './dom/models';

type DescriptionItemNode = [[ListItemNode], ListItemNode];

export class DescriptionListRenderer extends BlockNodeRenderer<ListNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  renderChildren(node: ListNode): string {
    const items = node.getItems<DescriptionItemNode>();
    return items.map(([[term], description]) => [
        term.convert(),
        '::',
        description.getBlocks().length > 0 ? '\n' : ' ',
        description.convert(),
      ].join(''),
    ).join('\n');
  }
}
