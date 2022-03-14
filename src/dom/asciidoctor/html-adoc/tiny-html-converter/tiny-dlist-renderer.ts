import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import ListItem = Asciidoctor.ListItem;

export class TinyDlistRenderer extends BaseTinyNodeRenderer<Asciidoctor.List> {
  protected readonly tagName = 'dl';

  protected getContent(node: Asciidoctor.List): string {
    const items = node.getItems() as [[ListItem], ListItem];
    return items.map(it => {
      const terms = it[0];
      const value = it[1];
      return terms.map(name => `<dt>${name.convert()}</dt><dd>${value.convert()}</dd>`).join('');
    }).join('');
  }
}
