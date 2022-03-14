import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyVideoRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  tagName = 'video';

  protected getContent(node: Asciidoctor.Block): string {
    return `Your browser does not support the video tag.`;
  }
}
