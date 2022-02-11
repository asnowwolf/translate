import { AdocNode, BlockNodeRenderer } from './block-node-renderer';
import { ListItemNode } from './list-item-renderer';

interface ListNode extends AdocNode {
  getItems(): ListItemNode[];
}

export class ListRenderer extends BlockNodeRenderer<ListNode> {
  ignoredAttributes = ['checklist-option'];
  defaultAttributes = { style: 'arabic' };

  renderBody(node: ListNode): string {
    return '';
  }

  protected getBlockTitle(node: ListNode): string {
    return node.getTitle();
  }
}
