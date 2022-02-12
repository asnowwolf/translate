import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineAnchorNode extends AdocNode {
  getTarget(): string;
}

export class InlineAnchorRenderer extends InlineNodeRenderer<InlineAnchorNode> {
  render(node: InlineAnchorNode): string {
    const text = node.getText();
    const target = node.getTarget();
    switch (node.getType()) {
      case 'link':
        if (text === target || target.split(':')?.[1] === text) {
          return text;
        } else {
          return `${target}[${text}]`;
        }
      case 'xref':
        const content = [target.replace(/^#/, ''), text].filter(it => !!it).join(',');
        return content ? `<<${content}>>` : '';
    }
  }
}
