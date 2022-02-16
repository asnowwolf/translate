import { InlineNode } from './dom/models';
import { InlineNodeRenderer } from './inline-node-renderer';

export class InlineCalloutRenderer extends InlineNodeRenderer<InlineNode> {
  render(node: InlineNode): string {
    return `<${node.getText()}>`;
  }
}
