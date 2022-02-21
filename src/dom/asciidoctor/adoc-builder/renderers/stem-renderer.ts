import { BlockNodeRenderer } from './block-node-renderer';
import { AbstractNode } from '../dom/abstract-node';
import { AbstractBlockNode } from '../dom/abstract-block-node';

export class StemRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  protected getDefaultAttributes(node: AbstractNode): { [p: string]: any } {
    return { style: 'asciimath' };
  }

  protected renderBody(node: AbstractBlockNode): string {
    const delimiter = '++++';
    return [delimiter, node.getContent(), delimiter].join('\n');
  }
}
