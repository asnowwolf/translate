import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineMenuNode extends AdocNode {
  getAttributes(): { menu: string, submenus: string[], menuitem: string };
}

export class InlineMenuRenderer extends InlineNodeRenderer<InlineMenuNode> {
  render(node: InlineMenuNode): string {
    const { menu, submenus, menuitem } = node.getAttributes();
    return `menu:${menu}[${[...submenus, menuitem].join(' > ')}]`;
  }
}
