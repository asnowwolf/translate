import { AdocAttribute, AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';
import { InlineableAttribute } from './utils/inlineable-attributes';

interface VerseNode extends AdocNode {
}

export class VerseRenderer extends BlockNodeRenderer<VerseNode> {
  positionalAttributes: InlineableAttribute[] = [
    { name: 'style', position: 1 },
    { name: 'attribution', position: 2 },
    { name: 'citetitle', position: 3 },
  ];

  protected getBlockAttributes(node: VerseNode): AdocAttribute[] {
    return super.getAttributes(node);
  }
}
