import { InlineNodeRenderer } from './inline-node-renderer';
import { NodeAttributes } from '../dom/node-attributes';
import { ListItemNode } from '../dom/list-node';

interface ListItemAttribute extends NodeAttributes {
  coids: string;
  checkbox: string;
  checked: string;
}

function getMarker(node: ListItemNode): string {
  const callouts = node.getDocument().getCallouts().$current_list();
  const attributes = node.getAttributes<ListItemAttribute>();
  const coids = attributes.coids;
  const callout = callouts.find(it => it.$$smap.id === coids);
  const ordinal = callout?.$$smap?.ordinal;
  if (ordinal === undefined) {
    return node.marker;
  } else {
    return `<${ordinal}>`;
  }
}

export class ListItemRenderer extends InlineNodeRenderer<ListItemNode> {
  ignoredAttributeNames = ['checkbox', 'checked', 'coids'];

  render(node: ListItemNode): string {
    const attributes = node.getAttributes<ListItemAttribute>();
    const checkbox = attributes.checkbox === '' ? attributes.checked === '' ? '[x]' : '[ ]' : '';
    const text = [getMarker(node), checkbox, node.getText()].filter(it => !!it?.trim?.()).join(' ');
    return [text, node.getBlocks().map(it => it.convert()).join('\n').trim()].filter(it => it.trim()).join('\n');
  }
}
