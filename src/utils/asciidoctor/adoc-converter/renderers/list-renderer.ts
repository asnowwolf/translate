import { BlockNodeRenderer } from './block-node-renderer';
import { ListItemNode } from './list-item-renderer';
import { AdocNode } from './adoc-node';

interface ListNode extends AdocNode {
  getItems(): ListItemNode[];
}

export class ListRenderer extends BlockNodeRenderer<ListNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  getDefaultAttributes(node: ListNode): { [key: string]: any } {
    return { style: 'arabic' };
  }

  protected getBlockTitle(node: ListNode): string {
    return node.getTitle();
  }
}
