import asciidoctor, { Asciidoctor } from '@asciidoctor/core';
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


export namespace adoc {
  type SubstitutionMode = Asciidoctor['Substitutors']['$$const'];
  const doc = asciidoctor();

  export function isParagraph(node: AbstractNode): boolean {
    return node?.getNodeName() === 'paragraph';
  }

  export function isSection(node: AbstractNode): node is Section {
    return node?.getNodeName() === 'section';
  }

  export function isFloatingTitle(node: AbstractNode): node is Section {
    return node?.getNodeName() === 'floating_title';
  }

  export function isDocument(node: AbstractNode): node is Document {
    return node?.getNodeName() === 'document' || node.getNodeName() === 'embedded';
  }

  export function isAbstractBlock(node: AbstractNode): node is AbstractBlock {
    return node.isBlock();
  }

  export function isInline(node: AbstractNode): node is Inline {
    return node.isInline();
  }

  export function isIndexTerm(node: AbstractNode): node is Inline {
    return node?.getNodeName() === 'inline_indexterm';
  }

  export function isList(node: AbstractNode): node is List {
    return node?.getNodeName() === 'ulist' || node.getNodeName() === 'olist';
  }

  export function isDescriptionList(node: AbstractNode): node is DefList {
    return node?.getNodeName() === 'dlist';
  }

  export function isListItem(node: AbstractNode): node is ListItem {
    return node?.getNodeName() === 'list_item';
  }

  export function setSubstitutionMode(doc: Asciidoctor, mode: SubstitutionMode): SubstitutionMode {
    const consts = doc.Substitutors.$$const;
    const result = { ...consts };
    consts.BASIC_SUBS = mode.BASIC_SUBS;
    consts.HEADER_SUBS = mode.HEADER_SUBS;
    consts.NORMAL_SUBS = mode.NORMAL_SUBS;
    consts.REFTEXT_SUBS = mode.REFTEXT_SUBS;
    consts.VERBATIM_SUBS = mode.VERBATIM_SUBS;
    return result;
  }


  export function setSubstitutionsForAdoc(doc: Asciidoctor): void {
    setSubstitutionMode(doc, {
      BASIC_SUBS: [],
      HEADER_SUBS: [],
      NORMAL_SUBS: [],
      REFTEXT_SUBS: [],
      VERBATIM_SUBS: ['callouts'],
    });
  }

  export function setSubstitutionsForDefaultHtml(doc: Asciidoctor): void {
    setSubstitutionMode(doc, {
      BASIC_SUBS: ['specialcharacters'],
      HEADER_SUBS: ['specialcharacters', 'attributes'],
      NORMAL_SUBS: ['specialcharacters', 'quotes', 'attributes', 'replacements', 'macros', 'post_replacements'],
      REFTEXT_SUBS: ['specialcharacters', 'quotes', 'replacements'],
      VERBATIM_SUBS: ['specialcharacters', 'callouts'],
    });
  }

  export function setSubstitutionsForTranslatableHtml(doc: Asciidoctor): void {
    setSubstitutionMode(doc, {
      BASIC_SUBS: ['specialcharacters'],
      HEADER_SUBS: ['specialcharacters', 'attributes'],
      NORMAL_SUBS: ['specialcharacters', 'quotes', 'attributes', 'macros'],
      REFTEXT_SUBS: ['specialcharacters', 'quotes'],
      VERBATIM_SUBS: ['specialcharacters', 'callouts'],
    });
  }

  export function isBlockImage(node: AbstractNode): node is Block {
    return node?.getNodeName() === 'image';
  }

  export function isBlockResource(node: AbstractNode): node is Block {
    return node?.getNodeName() === 'video' || node.getNodeName() === 'audio';
  }

  export function isAdmonition(node: AbstractNode): node is Block {
    return node?.getNodeName() === 'admonition';
  }

  export function isExample(node: AbstractNode): node is Block {
    return node?.getNodeName() === 'example';
  }

  export function isQuote(node: AbstractNode): node is Block {
    return node?.getNodeName() === 'quote';
  }

  export function isTable(node: AbstractNode): node is Table {
    return node?.getNodeName() === 'table';
  }

  export function isSidebar(node: AbstractNode): node is Block {
    return node?.getNodeName() === 'sidebar';
  }

  export function isVerse(node: AbstractNode): node is Block {
    return node?.getNodeName() === 'verse';
  }

  export function isListing(node: AbstractNode): node is Block {
    return node?.getNodeName() === 'listing';
  }

  export function hasLines(node: AbstractNode): node is Block {
    return 'lines' in node;
  }

  export function escapeDirectives(content: string): string {
    return content
      .replace(/^\[(.*)indent=("?)(\d+)("?)(.*)]$/gm, '[$1rawIndent=$2$3$4$5]')
      .replace(/^((?:ifdef|ifndef|ifeval|endif)::\[.*])$/gm, '`begin-directive:[$1]end-directive`')
      .replace(/^(include::.*?])$/gm, '`begin-directive:[$1]end-directive`')
      .replace(/^(\/\/ *(?:tag|end)::.*?])$/gm, '`begin-directive:[$1]end-directive`');
  }

  export function unescapeDirectives(content: string): string {
    return content
      .replace(/^\[(.*)rawIndent=("?)(\d+)("?)(.*)]$/gm, '[$1indent=$2$3$4$5]')
      .replace(/^`begin-directive:\[(.*?)]end-directive`$/gm, '$1')
      .replace(/^Unresolved directive in .* - (.*)$/gm, '$1');
  }

  export function createBlock(parent: AbstractBlock, context: string): Block {
    return doc.Block.create(parent, context);
  }

  export function createInline(parent: AbstractBlock, context: string): Inline {
    return doc.Inline.create(parent, context);
  }

  export function createNode(parent: AbstractBlock, context: string): AbstractBlock | Inline {
    if (context === 'document' || context === 'embedded' || !context) {
      return parent;
    }

    if (context.startsWith('inline_')) {
      return createInline(parent, context);
    } else {
      const child = createBlock(parent, context);
      if (!adoc.isDocument(child)) {
        parent.append(child);
      }
      return child;
    }
  }

  export function removeNode(node: Asciidoctor.Block): void {
    const siblings = (node.getParent() as AbstractBlock).getBlocks();
    siblings.splice(siblings.indexOf(node), 1);
  }
}
