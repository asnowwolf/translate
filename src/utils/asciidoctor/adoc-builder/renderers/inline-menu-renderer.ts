import { InlineNodeRenderer } from './inline-node-renderer';
import { InlineNode } from '../dom/inline-node';

interface InlineMenuAttributes {
  menu: string;
  submenus: string[];
  menuitem: string;
}

export class InlineMenuRenderer extends InlineNodeRenderer<InlineNode> {
  render(node: InlineNode): string {
    const { menu, submenus, menuitem } = node.getAttributes<InlineMenuAttributes>();
    return `menu:${menu}[${[...submenus, menuitem].join(' > ')}]`;
  }
}
