import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface ExampleNode extends AdocNode {
}

export class ExampleRenderer extends BlockNodeRenderer<ExampleNode> {
  render(node: ExampleNode): string {
    const header = this.renderHeader(node);
    const body = this.renderBody(node);
    const children = this.renderChildren(node);
    const delimiter = node.content_model === 'simple' ? '' : '====';
    return [[header, body].filter(it => !!it).join('\n'), delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
