import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface StemNode extends AdocNode {
}

export class StemRenderer extends BlockNodeRenderer<StemNode> {
  protected getDefaultAttributes(node: StemNode): { [p: string]: any } {
    return { style: 'asciimath' };
  }

  protected renderBody(node: StemNode): string {
    const delimiter = '++++';
    return [delimiter, node.getContent(), delimiter].join('\n');
  }
}
