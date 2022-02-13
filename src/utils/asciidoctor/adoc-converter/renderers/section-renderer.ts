import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface SectionNode extends AdocNode {
  getLevel(): number;
}

export class SectionRenderer extends BlockNodeRenderer<SectionNode> {
  renderBody(node: SectionNode): string {
    const title = node.getTitle() && `${'='.repeat(node.getLevel() + 1)} ${node.getTitle()}`;
    return [title, this.renderChildren(node)].filter(Boolean).join('\n\n');
  }
}
