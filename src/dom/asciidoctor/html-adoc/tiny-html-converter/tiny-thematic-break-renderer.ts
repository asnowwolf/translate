import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyThematicBreakRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  protected selfClosingTag = true;
  tagName = 'hr';
}
