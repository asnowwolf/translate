import { AdocAttribute, AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';
import { InternalAttribute } from './utils/internal-attributes';

interface VerseNode extends AdocNode {
}

export class VerseRenderer extends BlockNodeRenderer<VerseNode> {
  internalAttributes: InternalAttribute[] = [
    { name: 'style', position: 1 },
    { name: 'attribution', position: 2 },
    { name: 'citetitle', position: 3 },
  ];

  protected getBlockAttributes(node: VerseNode): AdocAttribute[] {
    return super.getAttributes(node);
  }
}
