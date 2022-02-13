import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface SectionNode extends AdocNode {
  getLevel(): number;
}

export class SectionRenderer extends BlockNodeRenderer<SectionNode> {
  ignoredAttributes = ['style'];

  renderBody(node: SectionNode): string {
    const title = node.getTitle();
    return title && `${'='.repeat(node.getLevel() + 1)} ${title}\n`;
  }
}
