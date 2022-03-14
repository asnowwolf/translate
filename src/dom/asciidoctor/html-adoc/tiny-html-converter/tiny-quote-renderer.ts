import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyQuoteRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  protected readonly tagName = 'blockquote';
}
