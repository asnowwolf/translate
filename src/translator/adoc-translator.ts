import { Adoc } from '../dom/asciidoctor/utils/adoc';
import { Asciidoctor } from '@asciidoctor/core';
import { tinyHtmlToAdoc } from '../dom/asciidoctor/html-adoc/tiny-html-to-adoc';
import { adocToTinyHtml } from '../dom/asciidoctor/html-adoc/adoc-to-tiny-html';
import { AdocBuilder } from '../dom/asciidoctor/adoc-builder/adoc-builder';
import { AbstractTranslator } from './abstract-translator';
import { containsChinese } from '../dom/common';
import { sameExceptWhitespace } from './same-except-whitespace';
import AbstractNode = Asciidoctor.AbstractNode;
import Block = Asciidoctor.Block;
import AbstractBlock = Asciidoctor.AbstractBlock;
import Table = Asciidoctor.Table;
import Cell = Asciidoctor.Table.Cell;
import Document = Asciidoctor.Document;

export class AdocTranslator extends AbstractTranslator<AbstractNode> {
  private builder = new AdocBuilder();
  readonly inlinePairSeparator = '$$$';

  translateDoc(doc: AbstractNode): AbstractNode {
    if (Adoc.isAbstractBlock(doc)) {
      if (!Adoc.isDocument(doc)) {
        const title = doc.getTitle();
        if (title && !doc.hasAttribute(`original_title`) && !containsChinese(title)) {
          this.translateAdoc(title).then(translation => {
            if (translation && !sameExceptWhitespace(translation, title)) {
              doc.setAttribute(`original_title`, title);
              doc.setTitle(translation);
            }
          });
        }
      }
      this.translateAttribute(doc, 'title');
      if (Adoc.isList(doc)) {
        doc.getItems().forEach((it) => this.translateDoc(it));
      } else if (Adoc.isDescriptionList(doc)) {
        doc.getItems().flat(9).forEach((it) => this.translateDoc(it));
      } else {
        doc.getBlocks().filter(it => it !== doc).forEach((it) => this.translateDoc(it));
      }
    }
    if (Adoc.hasLines(doc) && !['source', 'asciimath', 'literal'].includes(doc.getStyle()) && !this.hasTranslated(doc)) {
      const text = doc.lines.join('\n');
      this.translateAdoc(text).then(translation => {
        if (sameExceptWhitespace(text, translation)) {
          return;
        }
        if (Adoc.isListItem(doc.getParent())) {
          doc.lines = [[text, translation].join(this.inlinePairSeparator)];
        } else {
          const englishLines = doc.lines.join('\n').split('\n\n');
          const chineseLines = translation.trim().split('\n\n');
          doc.lines = this.mergeLines(englishLines, chineseLines);
        }
      });
    }

    if (Adoc.isDocument(doc)) {
      this.translateAttribute(doc, 'doctitle');
      this.translateAttribute(doc, 'description');
    }

    if (Adoc.isQuote(doc)) {
      this.translateAttribute(doc, 'title');
      this.translateAttribute(doc, 'citetitle');
      this.translateAttribute(doc, 'attribution');
    }

    if (Adoc.isListItem(doc)) {
      const text = doc.getText().toString().trim();
      const pairs = text.split(this.inlinePairSeparator);
      if (pairs.length === 2) {
        return;
      }
      this.translateAdoc(text).then(translation => {
        if (!sameExceptWhitespace(text, translation)) {
          doc.setText([text, translation].join(this.inlinePairSeparator));
        }
      });
    }

    if (Adoc.isBlockImage(doc)) {
      this.translateAttribute(doc, 'alt');
    }

    if (Adoc.isBlockResource(doc)) {
      this.translateAttribute(doc, 'poster');
    }

    if (Adoc.isTable(doc)) {
      const rows = doc.getRows();
      this.translateHeadRows(rows.head);
      this.translateRows(rows.body);
      this.translateRows(rows.foot);
    }
    if (Adoc.isVerse(doc)) {
      this.translateAttribute(doc, 'attribution');
      this.translateAttribute(doc, 'citetitle');
    }
    return doc;
  }

  parse(text: string): Asciidoctor.AbstractNode {
    return this.builder.parse(text);
  }

  serialize(doc: Asciidoctor.AbstractNode): string {
    return this.builder.build(doc as Document);
  }

  async translateAdoc(text: string): Promise<string> {
    if (containsChinese(text)) {
      return text;
    }
    text = text.toString();
    if (!text) {
      return '';
    }
    const html = unwrap(adocToTinyHtml(text));
    return await this.translateSentence(html, 'html').then(translation => tinyHtmlToAdoc(wrap(translation)));
  }

  translateAttribute(node: AbstractNode, attributeName: string): void {
    if (attributeName.startsWith('original_') || node.hasAttribute(`original_${attributeName}`)) {
      return;
    }
    const attribute = node.getAttribute(attributeName);
    if (attribute) {
      this.translateAdoc(attribute).then(translation => {
        if (translation && !sameExceptWhitespace(attribute, translation)) {
          node.setAttribute(attributeName, translation);
          if (attribute !== translation) {
            node.setAttribute(`original_${attributeName}`, attribute);
          }
        }
      });
    }
  }

  mergeLines(englishLines: string[], chineseLines: string[]): string[] {
    if (englishLines.length !== chineseLines.length) {
      throw 'Cannot merge!';
    }
    const result = [];
    for (let i = 0; i < englishLines.length; ++i) {
      const english = englishLines[i];
      const chinese = chineseLines[i];
      if (english && english !== chinese) {
        result.push(english);
        result.push('');
        result.push(chinese);
        const isLastLine = i === englishLines.length - 1;
        if (!isLastLine) {
          result.push('');
        }
      } else {
        result.push(english);
      }
    }
    return result;
  }

  hasTranslated(node: Block): boolean {
    if (containsChinese(node.lines.join('\n'))) {
      return true;
    }
    const parent = node.getParent() as AbstractBlock;
    const index = parent.getBlocks().indexOf(node);
    const next = parent.getBlocks()[index + 1];
    if (!next || next.getNodeName() !== node.getNodeName()) {
      return false;
    }
    return containsChinese(next.lines.join('\n'));
  }

  translateRows(rows: Table.Cell[][]): void {
    rows.map(row => row.map((cell: Cell) => {
      if (containsChinese(cell.getText())) {
        return;
      }
      this.translateAdoc(cell.text).then(translation => {
        if (translation !== cell.text) {
          cell.style = 'asciidoc';
          cell.text = `${cell.text}\n\n${translation}`;
        }
      });
    }));
  }

  translateHeadRows(rows: Table.Cell[][]): void {
    rows.map(row => row.map((cell: Cell) => {
      if (containsChinese(cell.getText())) {
        return;
      }
      // 标题行不支持 asciidoc 模式，因此只做简单的替换
      this.translateAdoc(cell.text).then(translation => {
        if (translation !== cell.text) {
          cell.text = translation;
        }
      });
    }));
  }
}

function unwrap(text: string): string {
  return text
    .replace(/\bprop-alt=/g, 'alt=')
    .replace(/^<article adoc-name="document"><p adoc-name="paragraph">(.*)<\/p><\/article>$/gs, '$1');
}

function wrap(text: string): string {
  const content = text.replace(/\balt=/g, 'prop-alt=');
  return `<article adoc-name="document"><p adoc-name="paragraph">${content}</p></article>`;
}
