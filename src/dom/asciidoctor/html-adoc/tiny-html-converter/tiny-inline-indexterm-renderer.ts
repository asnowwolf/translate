import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyInlineIndextermRenderer extends BaseTinyNodeRenderer<Asciidoctor.Inline> {
  protected readonly tagName = 'a';
  protected ignoredAttributeNames = ['terms'];

  protected getContent(node: Asciidoctor.Inline): string {
    const terms = node.getType() === 'visible' ?
      Array.from(node.getText().matchAll(/('.*?'|".*?"|[^,]+)/g)).map(it => it[0]) :
      node.getAttribute('terms');
    return terms?.map(term => `<span class="term">${term.trim()}</span>`).join('') ?? '';
  }
}
