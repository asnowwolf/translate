import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyAudioRenderer extends BaseTinyNodeRenderer<Asciidoctor.Block> {
  protected readonly tagName = 'audio';

  protected getContent(node: Asciidoctor.Block): string {
    return `Your browser does not support the audio tag.`;
  }
}
