import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyPreambleRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  protected readonly tagName = 'summary';

  render(node: Asciidoctor.Block): string {
    return super.render(node);
  }
}
