import { BlockNodeRenderer } from './block-node-renderer';
import { BlockNode } from './dom/models';
import { restoreIncludeUrl } from './utils/restore-include-url';

export class ParagraphRenderer extends BlockNodeRenderer<BlockNode> {
  protected renderChildren(node: BlockNode): string {
    return node.lines.map(it => restoreIncludeUrl(it)).join('\n');
  }
}
