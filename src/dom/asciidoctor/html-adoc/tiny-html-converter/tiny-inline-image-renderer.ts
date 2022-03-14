import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyInlineImageRenderer extends BaseTinyNodeRenderer<Asciidoctor.Inline> {
  protected readonly tagName = 'img';
  protected selfClosingTag = true;
  ignoredAttributeNames = ['alt'];

  render(node: Asciidoctor.Inline): string {
    return `<${this.tagName}${this.renderAttributes(node)} />`;
  }
}
