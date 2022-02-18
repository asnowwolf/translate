import { BlockNodeRenderer } from './block-node-renderer';
import { needDelimiter } from './utils/need-delimiter';
import { AbstractBlockNode } from '../dom/abstract-block-node';
import { AttributeEntry } from '../dom/document-node';

export class AdmonitionRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  renderBody(node: AbstractBlockNode): string {
    const children = this.renderChildren(node);
    const prefix = !needDelimiter(node) ? `${node.getStyle()}: ` : '';
    const delimiter = !needDelimiter(node) ? '' : '====';
    return [delimiter, prefix + children.trim(), delimiter].filter(it => !!it).join('\n') + '\n';
  }

  protected getBlockAttributes(node: AbstractBlockNode): AttributeEntry[] {
    return super.getBlockAttributes(node).filter(it => !isDefaultValue(it, node));
  }
}

function isDefaultValue(it: AttributeEntry, node: AbstractBlockNode) {
  return ['style', 'name', 'textlabel'].includes(it.name) &&
    it.value.toString().toLowerCase() === node.getStyle().toLowerCase();
}
