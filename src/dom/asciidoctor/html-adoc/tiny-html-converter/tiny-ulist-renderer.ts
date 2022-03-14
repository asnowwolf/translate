import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyUlistRenderer extends BaseTinyNodeRenderer<Asciidoctor.List> {
  tagName = 'ul';

  protected getContent(node: Asciidoctor.List): string {
    return node.getItems().map(it => it.convert()).join('');
  }
}
