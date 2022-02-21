import { InlineNodeRenderer } from './inline-node-renderer';
import { InlineNode } from '../dom/inline-node';

export class InlineCalloutRenderer extends InlineNodeRenderer<InlineNode> {
  render(node: InlineNode): string {
    return `<${node.getText()}>`;
  }
}
