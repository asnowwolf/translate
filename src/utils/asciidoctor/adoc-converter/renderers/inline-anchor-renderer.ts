import { AdocNode, BlockNodeRenderer } from './block-node-renderer';

interface InlineAnchorNode extends AdocNode {

}

export class InlineAnchorRenderer extends BlockNodeRenderer<InlineAnchorNode> {
  renderBody(node: InlineAnchorNode): string {
    return '';
  }
}
