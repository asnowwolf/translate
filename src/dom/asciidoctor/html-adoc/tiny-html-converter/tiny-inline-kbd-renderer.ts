import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyInlineKbdRenderer extends BaseTinyNodeRenderer<Asciidoctor.Inline> {
  protected readonly tagName = 'span';

  getContent(node: Asciidoctor.Inline): string {
    const keys = node.getAttribute('keys') as string[];
    return keys.map(it => `<kbd>${it}</kbd>`).join('+');
  }
}
