import { BlockNodeRenderer } from './block-node-renderer';
import { InlineableAttribute } from './utils/inlineable-attributes';
import { AbstractBlockNode } from '../dom/abstract-block-node';
import { AttributeEntry } from '../dom/document-node';

export class VerseRenderer extends BlockNodeRenderer<AbstractBlockNode> {
  positionalAttributes: InlineableAttribute[] = [
    { name: 'style', position: 1 },
    { name: 'attribution', position: 2 },
    { name: 'citetitle', position: 3 },
  ];

  protected getBlockAttributes(node: AbstractBlockNode): AttributeEntry[] {
    return super.getAttributes(node);
  }
}
