import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyFloatingTitleRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  protected readonly tagName = 'h2';

  protected getContent(node: Asciidoctor.Block): string {
    return node.getTitle();
  }
}
