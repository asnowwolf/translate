import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyInlineAnchorRenderer extends BaseTinyNodeRenderer<Asciidoctor.Inline> {
  protected readonly tagName = 'a';

  protected getContent(node: Asciidoctor.Inline) {
    const target = node.getTarget();
    const textForNatureReference = `${target.replace(/^#/, '')}`;
    return node.getText() ?? textForNatureReference;
  }
}
