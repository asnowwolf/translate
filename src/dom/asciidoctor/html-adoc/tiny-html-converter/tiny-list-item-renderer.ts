import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyListItemRenderer extends BaseTinyNodeRenderer<Asciidoctor.ListItem> {
  protected tagName = 'li';

  render(node: Asciidoctor.ListItem): string {
    const list = node.getList();
    if (list.getNodeName() === 'dlist') {
      return this.getContent(node);
    } else {
      return super.render(node);
    }
  }

  protected getContent(node: Asciidoctor.ListItem): string {
    return [node.hasText() && node.getText(), node.getBlocks().map(it => it.convert()).join('').trim()]
      .filter(it => !!it)
      .filter(it => it.trim())
      .join('');
  }
}
