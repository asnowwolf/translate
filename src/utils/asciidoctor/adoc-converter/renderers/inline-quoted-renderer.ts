import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineQuotedNode extends AdocNode {

}

export class InlineQuotedRenderer extends InlineNodeRenderer<InlineQuotedNode> {
  render(node: InlineQuotedNode): string {
    const quote = quotes[node.getType()];
    return [quote, node.getText(), quote].join('');
  }
}

const quotes = {
  'strong': '*',
  'monospaced': '`',
  'emphasis': '_',
  'mark': '#',
  'superscript': '^',
  'subscript': '~',
};
