import { AdocAttribute, AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface AdmonitionNode extends AdocNode {
  getStyle(): string;
}

export class AdmonitionRenderer extends BlockNodeRenderer<AdmonitionNode> {
  render(node: AdmonitionNode): string {
    const header = this.renderHeader(node);
    const body = this.renderBody(node);
    const children = this.renderChildren(node);
    if (isSimpleForm(header)) {
      return [[header, node.getStyle()].filter(it => !!it).join('\n'), children].filter(it => !!it).join(': ');
    } else {
      return [[header, body].filter(it => !!it).join('\n'), '====', children.trim(), '===='].filter(it => !!it).join('\n');
    }
  }

  protected getHeaderAttributes(node: AdmonitionNode): AdocAttribute[] {
    return super.getHeaderAttributes(node).filter(it => !isDefaultValue(it, node));
  }
}

function isDefaultValue(it: AdocAttribute, node: AdmonitionNode) {
  return ['style', 'name', 'textlabel'].includes(it.name) && it.value.toLowerCase() === node.getStyle().toLowerCase();
}

function isSimpleForm(header: string): boolean {
  return !header;
}
