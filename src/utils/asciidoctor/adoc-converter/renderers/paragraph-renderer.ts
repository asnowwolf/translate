import { AdocNode, BlockNodeRenderer } from './block-node-renderer';

interface ParagraphNode extends AdocNode {
}

export class ParagraphRenderer extends BlockNodeRenderer<ParagraphNode> {
}
