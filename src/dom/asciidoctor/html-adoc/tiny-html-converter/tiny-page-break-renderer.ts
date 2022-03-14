import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyPageBreakRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  protected selfClosingTag = true;
  protected readonly tagName = 'hr';
}
