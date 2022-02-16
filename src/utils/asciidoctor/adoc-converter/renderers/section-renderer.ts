import { BlockNodeRenderer } from './block-node-renderer';
import { SectionNode } from './dom/models';

export class SectionRenderer extends BlockNodeRenderer<SectionNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  renderBody(node: SectionNode): string {
    const title = node.getTitle() && `${'='.repeat(node.getLevel() + 1)} ${node.getTitle()}`;
    return title && `${title}\n\n${node.getContent()}`;
  }
}
