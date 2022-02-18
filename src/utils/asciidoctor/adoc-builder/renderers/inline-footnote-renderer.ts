import { InlineNodeRenderer } from './inline-node-renderer';
import { InlineNode } from '../dom/inline-node';

export class InlineFootnoteRenderer extends InlineNodeRenderer<InlineNode> {
  ids: { [index: number]: string } = {};

  render(node: InlineNode): string {
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
