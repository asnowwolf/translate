import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface SidebarNode extends AdocNode {
  getStyle(): string;
}

export class SidebarRenderer extends BlockNodeRenderer<SidebarNode> {
  ignoredAttributes = ['style'];

  renderBody(node: SidebarNode): string {
    const children = this.renderChildren(node);
    const delimiter = node.content_model === 'simple' ? '' : '****';
    return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
