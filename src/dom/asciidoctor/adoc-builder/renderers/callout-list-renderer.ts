import { BlockNodeRenderer } from './block-node-renderer';
import { ListNode } from '../dom/list-node';

export class CalloutListRenderer extends BlockNodeRenderer<ListNode> {
  protected getDefaultAttributes(node: ListNode): { [p: string]: any } {
    return { style: 'arabic' };
  }
}
