import { BlockNodeRenderer } from './block-node-renderer';
import { InlineableAttribute } from './utils/inlineable-attributes';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;
import AttributeEntry = Asciidoctor.Document.AttributeEntry;

export class VerseRenderer extends BlockNodeRenderer<AbstractBlock> {
  positionalAttributes: InlineableAttribute[] = [
    { name: 'style', position: 1 },
    { name: 'attribution', position: 2 },
    { name: 'citetitle', position: 3 },
  ];

  protected getBlockAttributes(node: AbstractBlock): AttributeEntry[] {
    return super.getAttributes(node);
  }
}
