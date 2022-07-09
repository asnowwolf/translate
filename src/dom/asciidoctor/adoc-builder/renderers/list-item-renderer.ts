import { Asciidoctor } from '@asciidoctor/core';
import { BlockNodeRenderer } from './block-node-renderer';
import { adoc } from '../../utils/adoc';
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
    const blocks = node.getBlocks();
    if (!blocks.length) {
      return text;
    }
    if (blocks.length > 1) {
      for (let i = 0; i < blocks.length; ++i) {
        const block = blocks[i];
        if (adoc.isList(block)) {
          const wrapper = adoc.createBlock(node, 'open');
          wrapper.getBlocks().splice(0, 0, block);
          blocks[i] = wrapper;
        }
      }
    }
    const separator = blocks.length === 1 && adoc.isList(blocks[0]) ? '\n' : '\n+\n';
    const suffix = blocks.length > 0 && !adoc.isList(blocks[0]) ? '\n' : '';
    const contents = blocks.map(it => it.convert().trim());
    return [text, ...contents].filter(it => !!it).join(separator) + suffix;
  }
}
