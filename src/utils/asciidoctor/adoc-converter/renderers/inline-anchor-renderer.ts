import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineAnchorNode extends AdocNode {

}

export class InlineAnchorRenderer extends InlineNodeRenderer<InlineAnchorNode> {
}
