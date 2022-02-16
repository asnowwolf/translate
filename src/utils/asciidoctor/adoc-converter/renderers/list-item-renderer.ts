import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

export interface ListItemNode extends AdocNode {
  marker: string;

  getAttributes(): { coids: string, checkbox: string, checked: string };
}

function getMarker(node: ListItemNode): string {
  const attributes = node.getAttributes();
  const coids = attributes.coids;
  if (!coids) {
    return node.marker;
  } else {
    const relatedNode = node.getDocument().idMap?.[coids];
    const text = relatedNode?.getText();
    return text ? `<${text}>` : node.marker;
  }
}

export class ListItemRenderer extends BlockNodeRenderer<ListItemNode> {
  ignoredAttributeNames = ['checkbox', 'checked', 'coids'];

  renderBody(node: ListItemNode): string {
    const attributes = node.getAttributes();
    const checkbox = attributes.checkbox === '' ? attributes.checked === '' ? '[x]' : '[ ]' : '';
    const text = [getMarker(node), checkbox, node.getText()].filter(it => !!it?.trim?.()).join(' ');
    return [text, this.renderChildren(node).trim()].filter(it => it.trim()).join('\n');
  }
}
