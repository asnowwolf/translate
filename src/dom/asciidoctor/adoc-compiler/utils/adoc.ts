import { Asciidoctor } from '@asciidoctor/core';
import AbstractNode = Asciidoctor.AbstractNode;
import Block = Asciidoctor.Block;
import Section = Asciidoctor.Section;
import Document = Asciidoctor.Document;
import AbstractBlock = Asciidoctor.AbstractBlock;
import Inline = Asciidoctor.Inline;

export class Adoc {
  static isParagraph(node: AbstractNode): node is Block {
    return node.getNodeName() === 'paragraph';
  }

  static isSection(node: AbstractNode): node is Section {
    return node.getNodeName() === 'section';
  }

  static isDocument(node: AbstractNode): node is Document {
    return node.getNodeName() === 'document';
  }

  static isAbstractBlock(node: AbstractNode): node is AbstractBlock {
    return node.isBlock();
  }

  static isInline(node: AbstractNode): node is Inline {
    return node.isInline();
  }

  static isIndexTerm(node: AbstractNode): node is Inline {
    return node.getNodeName() === 'inline_indexterm';
  }
}
