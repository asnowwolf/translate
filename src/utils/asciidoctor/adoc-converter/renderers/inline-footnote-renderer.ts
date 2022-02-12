import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineFootnoteNode extends AdocNode {
}

export class InlineFootnoteRenderer extends InlineNodeRenderer<InlineFootnoteNode> {
  ids: { [index: number]: string } = {};

  render(node: InlineFootnoteNode): string {
    const text = node.getText();
    const index = node.getAttribute('index');
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
