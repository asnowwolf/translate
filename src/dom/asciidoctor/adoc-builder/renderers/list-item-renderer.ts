import { Asciidoctor } from '@asciidoctor/core';
import { BlockNodeRenderer } from './block-node-renderer';
import ListItem = Asciidoctor.ListItem;

interface ListItemAttribute {
  coids: string;
  checkbox: string;
  checked: string;
}

function getMarker(node: ListItem): string {
  const callouts = node.getDocument().getCallouts().getCurrentList();
  const attributes = node.getAttributes() as ListItemAttribute;
  const coids = attributes.coids;
  const callout = callouts.find(it => it.id === coids);
  const ordinal = callout?.ordinal;
  if (ordinal === undefined) {
    return node.getMarker();
  } else {
    return `<${ordinal}>`;
  }
}

export class ListItemRenderer extends BlockNodeRenderer<ListItem> {
  ignoredAttributeNames = ['checkbox', 'checked', 'coids'];

  render(node: ListItem): string {
    const attributes = node.getAttributes() as ListItemAttribute;
    const checkbox = attributes.checkbox === '' ? attributes.checked === '' ? '[x]' : '[ ]' : '';
    const text = [getMarker(node), checkbox, node.getText()].filter(it => !!it?.trim?.()).join(' ');
    return [text, node.getBlocks().map(it => it.convert()).join('\n').trim()].filter(it => it.trim()).join('\n');
  }
}
