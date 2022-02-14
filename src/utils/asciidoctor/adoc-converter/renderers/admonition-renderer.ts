import { AdocAttribute, AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';
import { hasEmptyLine } from './utils/has-empty-line';

interface AdmonitionNode extends AdocNode {
  getStyle(): string;
}

export class AdmonitionRenderer extends BlockNodeRenderer<AdmonitionNode> {
  renderBody(node: AdmonitionNode): string {
    const children = this.renderChildren(node);
    const prefix = !hasEmptyLine(node) ? `${node.getStyle()}: ` : '';
    const delimiter = !hasEmptyLine(node) ? '' : '====';
    return [delimiter, prefix + children.trim(), delimiter].filter(it => !!it).join('\n');
  }

  protected getBlockAttributes(node: AdmonitionNode): AdocAttribute[] {
    return super.getBlockAttributes(node).filter(it => !isDefaultValue(it, node));
  }
}

function isDefaultValue(it: AdocAttribute, node: AdmonitionNode) {
  return ['style', 'name', 'textlabel'].includes(it.name) && it.value.toLowerCase() === node.getStyle().toLowerCase();
}
