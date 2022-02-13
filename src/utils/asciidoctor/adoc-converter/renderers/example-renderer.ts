import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface ExampleNode extends AdocNode {
}

export class ExampleRenderer extends BlockNodeRenderer<ExampleNode> {
  ignoredAttributes = ['style'];
  renderBody(node: ExampleNode): string {
    const children = this.renderChildren(node);
    const delimiter = node.content_model === 'simple' ? '' : '====';
    return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
