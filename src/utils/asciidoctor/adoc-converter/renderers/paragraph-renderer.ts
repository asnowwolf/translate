import { BlockNodeRenderer } from './block-node-renderer';
import { BlockNode } from './dom/models';

export class ParagraphRenderer extends BlockNodeRenderer<BlockNode> {
  protected renderChildren(node: BlockNode): string {
    return node.lines.map(it => it).join('\n');
  }
}
