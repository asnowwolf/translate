import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyVerseRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  tagName = 'figure';
}
