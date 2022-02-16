import { BlockNodeRenderer } from './block-node-renderer';
import { ListNode } from './dom/models';

export class CalloutListRenderer extends BlockNodeRenderer<ListNode> {
  protected getDefaultAttributes(node: ListNode): { [p: string]: any } {
    return { style: 'arabic' };
  }
}
