import { Asciidoctor } from '@asciidoctor/core';
import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';

export class TinySectionRenderer extends BaseTinyNodeRenderer<Asciidoctor.Section> {
  tagName = 'section';
}
