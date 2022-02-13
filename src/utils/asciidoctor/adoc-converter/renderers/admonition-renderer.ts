import { AdocAttribute, AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface AdmonitionNode extends AdocNode {
  getStyle(): string;
}

export class AdmonitionRenderer extends BlockNodeRenderer<AdmonitionNode> {
  renderBody(node: AdmonitionNode): string {
    const children = this.renderChildren(node);
    const prefix = node.content_model === 'simple' ? `${node.getStyle()}: ` : '';
    const delimiter = node.content_model === 'simple' ? '' : '====';
    return [delimiter, prefix + children.trim(), delimiter].filter(it => !!it).join('\n');
  }

  protected getHeaderAttributes(node: AdmonitionNode): AdocAttribute[] {
    return super.getHeaderAttributes(node).filter(it => !isDefaultValue(it, node));
  }
}

function isDefaultValue(it: AdocAttribute, node: AdmonitionNode) {
  return ['style', 'name', 'textlabel'].includes(it.name) && it.value.toLowerCase() === node.getStyle().toLowerCase();
}
