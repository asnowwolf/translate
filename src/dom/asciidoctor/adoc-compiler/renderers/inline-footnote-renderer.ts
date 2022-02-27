import { InlineNodeRenderer } from './inline-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;

export class InlineFootnoteRenderer extends InlineNodeRenderer<Inline> {
  ids: { [index: number]: string } = {};

  render(node: Inline): string {
    const text = node.getText();
    const index = node.getAttribute('index') as number;
    if (node.getId()) {
      this.ids[index] = node.getId();
    }
    const type = node.getType();
    return [
      `footnote:`,
      this.ids[index],
      type === 'xref' ? '[]' : (text && `[${text}]`),
    ].filter(it => !!it).join('');
  }
}
