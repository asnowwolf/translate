import { BlockNodeRenderer } from './block-node-renderer';
import { AdocNode } from './adoc-node';

interface ParagraphNode extends AdocNode {
}

export class ParagraphRenderer extends BlockNodeRenderer<ParagraphNode> {
}
