import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface SourceCodeNode extends AdocNode {
}

export class SourceCodeRenderer extends BlockNodeRenderer<SourceCodeNode> {
  defaultAttributes = { style: 'listing', 'linenums-option': '', linenums: '' };
  positionalAttributes = [{ name: 'style', position: 1 }, { name: 'language', position: 2 }];

  protected renderBody(node: SourceCodeNode): string {
    const children = this.renderChildren(node);
    const delimiter = '----';
    return [delimiter, children.trim(), delimiter].filter(it => !!it).join('\n');
  }
}
