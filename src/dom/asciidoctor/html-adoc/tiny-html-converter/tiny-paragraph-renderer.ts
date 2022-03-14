import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyParagraphRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  protected readonly tagName = 'p';
}
