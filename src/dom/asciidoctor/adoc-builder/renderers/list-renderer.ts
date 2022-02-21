import { BlockNodeRenderer } from './block-node-renderer';
import { ListNode } from '../dom/list-node';

export class ListRenderer extends BlockNodeRenderer<ListNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  getDefaultAttributes(node: ListNode): { [key: string]: any } {
    return { style: 'arabic' };
  }

  protected getBlockTitle(node: ListNode): string {
    return node.getTitle();
  }
}
