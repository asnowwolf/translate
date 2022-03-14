import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import { quoteTypeToTag } from '../quotes';

export class TinyInlineQuotedRenderer extends BaseTinyNodeRenderer<Asciidoctor.Inline> {
  protected getTagName(node: Asciidoctor.Inline): string {
    return quoteTypeToTag(node.getType()) ?? 'span';
  }
}
