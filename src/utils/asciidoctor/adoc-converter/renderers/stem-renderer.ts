import { AbstractBlockNode, AbstractNode } from './dom/models';
import { BlockNodeRenderer } from './block-node-renderer';

export class StemRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  protected getDefaultAttributes(node: AbstractNode): { [p: string]: any } {
    return { style: 'asciimath' };
  }

  protected renderBody(node: AbstractBlockNode): string {
    const delimiter = '++++';
    return [delimiter, node.getContent(), delimiter].join('\n');
  }
}
