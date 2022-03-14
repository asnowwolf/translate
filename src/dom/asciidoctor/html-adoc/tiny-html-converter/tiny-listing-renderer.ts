import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyListingRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  protected getTagName(node: Asciidoctor.Block): string {
    if (node.getStyle() === 'source') {
      return 'code';
    } else {
      return 'pre';
    }
  }
}
