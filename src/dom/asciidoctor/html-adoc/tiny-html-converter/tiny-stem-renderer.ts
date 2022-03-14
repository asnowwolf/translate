import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyStemRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  tagName = 'blockquote';
}
