import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyOlistRenderer extends BaseTinyNodeRenderer<Asciidoctor.List> {
  protected readonly tagName = 'ol';

  protected getContent(node: Asciidoctor.List): string {
    return node.getItems().map(it => it.convert()).join('');
  }
}
