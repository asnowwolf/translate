import { Asciidoctor } from '@asciidoctor/core';
import AbstractNode = Asciidoctor.AbstractNode;
import Block = Asciidoctor.Block;
import Section = Asciidoctor.Section;
import Document = Asciidoctor.Document;
import AbstractBlock = Asciidoctor.AbstractBlock;
import Inline = Asciidoctor.Inline;
import ListItem = Asciidoctor.ListItem;
import List = Asciidoctor.List;
import DefList = Asciidoctor.DescriptionList;
import Table = Asciidoctor.Table;

type SubstitutionMode = Asciidoctor['Substitutors']['$$const'];

function setSubstitutionMode(adoc: Asciidoctor, mode: SubstitutionMode): SubstitutionMode {
  const consts = adoc.Substitutors.$$const;
  const result = { ...consts };
  consts.BASIC_SUBS = mode.BASIC_SUBS;
  consts.HEADER_SUBS = mode.HEADER_SUBS;
  consts.NORMAL_SUBS = mode.NORMAL_SUBS;
  consts.REFTEXT_SUBS = mode.REFTEXT_SUBS;
  consts.VERBATIM_SUBS = mode.VERBATIM_SUBS;
  return result;
}

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

  static isList(node: AbstractNode): node is List {
    return node.getNodeName() === 'ulist' || node.getNodeName() === 'olist';
  }

  static isDescriptionList(node: AbstractNode): node is DefList {
    return node.getNodeName() === 'dlist';
  }

  static isListItem(node: AbstractNode): node is ListItem {
    return node.getNodeName() === 'list_item';
  }

  static disableSubstitution(adoc: Asciidoctor): void {
    setSubstitutionMode(adoc, {
      BASIC_SUBS: [],
      HEADER_SUBS: [],
      NORMAL_SUBS: [],
      REFTEXT_SUBS: [],
      VERBATIM_SUBS: ['callouts'],
    });
  }

  static enableSubstitution(adoc: Asciidoctor): void {
    setSubstitutionMode(adoc, {
      BASIC_SUBS: ['specialcharacters'],
      HEADER_SUBS: ['specialcharacters', 'attributes'],
      NORMAL_SUBS: ['specialcharacters', 'quotes', 'attributes', 'replacements', 'macros', 'post_replacements'],
      REFTEXT_SUBS: ['specialcharacters', 'quotes', 'replacements'],
      VERBATIM_SUBS: ['specialcharacters', 'callouts'],
    });
  }

  static isBlockImage(node: AbstractNode): node is Block {
    return node.getNodeName() === 'image';
  }

  static isAdmonition(node: AbstractNode): node is Block {
    return node.getNodeName() === 'admonition';
  }

  static isExample(node: AbstractNode): node is Block {
    return node.getNodeName() === 'example';
  }

  static isQuote(node: AbstractNode): node is Block {
    return node.getNodeName() === 'quote';
  }

  static isTable(node: AbstractNode): node is Table {
    return node.getNodeName() === 'table';
  }
}
