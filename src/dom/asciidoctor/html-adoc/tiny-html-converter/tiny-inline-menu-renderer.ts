import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyInlineMenuRenderer extends BaseTinyNodeRenderer<Asciidoctor.Inline> {
  protected readonly tagName = 'span';

  getContent(node: Asciidoctor.Inline): string {
    return [node.getAttribute('menu'), ...node.getAttribute('submenus'), node.getAttribute('menuitem')].filter(it => !!it)
      .map(it => `<span>${it}</span>`).join('');
  }
}
