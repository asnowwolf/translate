import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface SidebarNode extends AdocNode {
  getStyle(): string;
}

export class SidebarRenderer extends BlockNodeRenderer<SidebarNode> {
  render(node: SidebarNode): string {
    const header = this.renderHeader(node);
    const body = this.renderBody(node);
    const children = this.renderChildren(node);
    const delimiter = node.content_model === 'simple' ? '' : '****';
    return [[header, body].filter(it => !!it).join('\n'), delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
