import { InlineNodeRenderer } from './inline-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;

interface InlineMenuAttributes {
  menu: string;
  submenus: string[];
  menuitem: string;
}

export class InlineMenuRenderer extends InlineNodeRenderer<Inline> {
  render(node: Inline): string {
    const { menu, submenus, menuitem } = node.getAttributes() as InlineMenuAttributes;
    return `menu:${menu}[${[...submenus, menuitem].join(' > ')}]`;
  }
}
