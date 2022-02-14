import { BlockNodeRenderer } from './block-node-renderer';
import { ListItemNode } from './list-item-renderer';
import { AdocNode } from './adoc-node';

interface ListNode extends AdocNode {
  getItems(): ListItemNode[];
}

export class ListRenderer extends BlockNodeRenderer<ListNode> {
  ignoredAttributeNames = ['checklist-option'];
  positionalAttributes = [{ name: 'style', position: 1 }];
  defaultAttributes = { style: 'arabic' };

  protected getBlockTitle(node: ListNode): string {
    return node.getTitle();
  }
}
