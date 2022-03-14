import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyTocRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  tagName = 'nav';
}
