import { BlockNodeRenderer } from './block-node-renderer';
import { ListNode } from './dom/models';

export class DescriptionListRenderer extends BlockNodeRenderer<ListNode> {
  renderChildren(node: ListNode): string {
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
