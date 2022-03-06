import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Section = Asciidoctor.Section;

export class SectionRenderer extends BlockNodeRenderer<Section> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  renderBody(node: Section): string {
    const title = node.getTitle() && `${'='.repeat(node.getLevel() + 1)} ${node.getTitle()}`;
    return title && `${title}\n\n${node.getContent()}`;
  }
}
