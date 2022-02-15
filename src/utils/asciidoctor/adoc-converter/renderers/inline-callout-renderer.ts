import { AdocNode } from './adoc-node';
import { InlineNodeRenderer } from './inline-node-renderer';

interface InlineCalloutNode extends AdocNode {
}

export class InlineCalloutRenderer extends InlineNodeRenderer<InlineCalloutNode> {
  render(node: InlineCalloutNode): string {
    const document = node.getDocument();
    document.idMap = document.idMap ?? {};
    document.idMap[node.getId()] = node;
    return `<${node.getText()}>`;
  }
}
