import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

export interface ListItemNode extends AdocNode {
  marker: string;
}

export class ListItemRenderer extends BlockNodeRenderer<ListItemNode> {
  ignoredAttributeNames = ['checkbox', 'checked'];

  renderBody(node: ListItemNode): string {
    const attributes = node.getAttributes();
    const checkbox = attributes.checkbox === '' ? attributes.checked === '' ? '[x]' : '[ ]' : '';
    const text = [node.marker, checkbox, node.getText()].filter(it => !!it?.trim?.()).join(' ');
    return [text, this.renderChildren(node).trim()].filter(it => it.trim()).join('\n');
  }
}
