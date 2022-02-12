import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

export interface ListItemNode extends AdocNode {
  marker: string;
}

export class ListItemRenderer extends BlockNodeRenderer<ListItemNode> {
  ignoredAttributes = ['checkbox', 'checked'];

  renderBody(item: ListItemNode): string {
    const attributes = item.getAttributes();
    const checkbox = attributes.checkbox === '' ? attributes.checked === '' ? '[x]' : '[ ]' : '';
    return [[item.marker, checkbox, item.getText()].filter(it => !!it?.trim?.()).join(' ')].filter(it => !!it?.trim?.()).join('\n');
  }
}
