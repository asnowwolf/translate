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

export class Adoc {
  static isParagraph(node: AbstractNode): node is Block {
    return node.getNodeName() === 'paragraph';
  }

  static isSection(node: AbstractNode): node is Section {
    return node.getNodeName() === 'section';
  }

  static isDocument(node: AbstractNode): node is Document {
    return node.getNodeName() === 'document' || node.getNodeName() === 'embedded';
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

  static setSubstitutionMode(adoc: Asciidoctor, mode: SubstitutionMode): SubstitutionMode {
    const consts = adoc.Substitutors.$$const;
    const result = { ...consts };
    consts.BASIC_SUBS = mode.BASIC_SUBS;
    consts.HEADER_SUBS = mode.HEADER_SUBS;
    consts.NORMAL_SUBS = mode.NORMAL_SUBS;
    consts.REFTEXT_SUBS = mode.REFTEXT_SUBS;
    consts.VERBATIM_SUBS = mode.VERBATIM_SUBS;
    return result;
  }


  static setSubstitutionsForAdoc(adoc: Asciidoctor): void {
    this.setSubstitutionMode(adoc, {
      BASIC_SUBS: [],
      HEADER_SUBS: [],
      NORMAL_SUBS: [],
      REFTEXT_SUBS: [],
      VERBATIM_SUBS: ['callouts'],
    });
  }

  static setSubstitutionsForDefaultHtml(adoc: Asciidoctor): void {
    this.setSubstitutionMode(adoc, {
      BASIC_SUBS: ['specialcharacters'],
      HEADER_SUBS: ['specialcharacters', 'attributes'],
      NORMAL_SUBS: ['specialcharacters', 'quotes', 'attributes', 'replacements', 'macros', 'post_replacements'],
      REFTEXT_SUBS: ['specialcharacters', 'quotes', 'replacements'],
      VERBATIM_SUBS: ['specialcharacters', 'callouts'],
    });
  }

  static setSubstitutionsForTranslatableHtml(adoc: Asciidoctor): void {
    this.setSubstitutionMode(adoc, {
      BASIC_SUBS: ['specialcharacters'],
      HEADER_SUBS: ['specialcharacters', 'attributes'],
      NORMAL_SUBS: ['specialcharacters', 'quotes', 'attributes', 'macros'],
      REFTEXT_SUBS: ['specialcharacters', 'quotes'],
      VERBATIM_SUBS: ['specialcharacters', 'callouts'],
    });
  }

  static isBlockImage(node: AbstractNode): node is Block {
    return node.getNodeName() === 'image';
  }

  static isBlockResource(node: AbstractNode): node is Block {
    return node.getNodeName() === 'video' || node.getNodeName() === 'audio';
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

  static isSidebar(node: AbstractNode): node is Block {
    return node.getNodeName() === 'sidebar';
  }

  static isVerse(node: AbstractNode): node is Block {
    return node.getNodeName() === 'verse';
  }

  static isListing(node: AbstractNode): node is Block {
    return node.getNodeName() === 'listing';
  }

  static hasLines(node: AbstractNode): node is Block {
    return 'lines' in node;
  }

  static escapeDirectives(content: string): string {
    return content
      .replace(/^\[(.*)indent=("?)(\d+)("?)(.*)]$/gm, '[$1rawIndent=$2$3$4$5]')
      .replace(/^((?:ifdef|ifndef|ifeval|endif)::\[.*])$/gm, '`begin-directive:[$1]end-directive`')
      .replace(/^(include::.*?])$/gm, '`begin-directive:[$1]end-directive`')
      .replace(/^(\/\/ *(?:tag|end)::.*?])$/gm, '`begin-directive:[$1]end-directive`');
  }

  static unescapeDirectives(content: string): string {
    return content
      .replace(/^\[(.*)rawIndent=("?)(\d+)("?)(.*)]$/gm, '[$1indent=$2$3$4$5]')
      .replace(/^`begin-directive:\[(.*?)]end-directive`$/gm, '$1')
      .replace(/^Unresolved directive in .* - (.*)$/gm, '$1');
  }
}
