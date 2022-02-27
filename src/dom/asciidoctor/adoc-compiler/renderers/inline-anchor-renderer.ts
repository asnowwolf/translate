import { InlineNodeRenderer } from './inline-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;

export class InlineAnchorRenderer extends InlineNodeRenderer<Inline> {
  render(node: Inline): string {
    const text = node.getText();
    const target = node.getTarget();
    switch (node.getType()) {
      case 'link':
        if (text === target || target.split(':')?.[1] === text) {
          return text;
        } else {
          const nonDefaultAttributes = this.getNonDefaultAttributes(node)
            .filter(it => it.name !== 'window' || text.endsWith('^') && it.value === '_blank');
          const content = [text, this.renderAttributes(nonDefaultAttributes)].filter(it => !!it).join(',');
          return `${target}[${content}]`;
        }
      case 'xref':
        const content = [target.replace(/^#/, '').replace(/^(.+?)(\.\w+)#(.*)$/, '$1#$3'), text].filter(it => !!it).join(',');
        return content ? `<<${content}>>` : '';
    }
  }
}
