import { BlockNodeRenderer } from './block-node-renderer';
import { ListItemNode } from './list-item-renderer';
import { AdocNode } from './adoc-node';

interface ListNode extends AdocNode {
  getItems(): ListItemNode[];
}

export class ListRenderer extends BlockNodeRenderer<ListNode> {
  ignoredAttributes = ['checklist-option'];
  defaultAttributes = { style: 'arabic' };

  renderBody(node: ListNode): string {
    return '';
  }

  protected renderChildren(node: ListNode): string {
    const children = `${super.renderChildren(node)}`;
    if (node.getParent().getNodeName() === 'list_item') {
      return children;
    } else {
      // 如果不是内层列表，则添加一个额外的回车
      return `${children}\n`;
    }
  }

  protected getBlockTitle(node: ListNode): string {
    return node.getTitle();
  }
}
