import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyInlineBreakRenderer extends BaseTinyNodeRenderer<Asciidoctor.Inline> {
  protected readonly tagName = 'br';
}
