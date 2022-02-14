import { BlockNodeRenderer } from './block-node-renderer';
import { AdocAttribute, AdocNode } from './adoc-node';
import { isSimpleForm } from './utils/is-simple-form';

interface SidebarNode extends AdocNode {
  getStyle(): string;
}

export class SidebarRenderer extends BlockNodeRenderer<SidebarNode> {
  positionalAttributes = [{ name: 'style', position: 1 }];

  protected getBlockAttributes(node: SidebarNode): AdocAttribute[] {
    const blockAttributes = super.getBlockAttributes(node);
    if (isSimpleForm(node)) {
      return blockAttributes;
    } else {
      return blockAttributes.filter(it => it.name !== 'style');
    }
  }

  renderBody(node: SidebarNode): string {
    const children = this.renderChildren(node);
    const delimiter = isSimpleForm(node) ? '' : '****';
    return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
