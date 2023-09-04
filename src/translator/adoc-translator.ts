import { adoc } from '../dom/asciidoctor/utils/adoc';
import { Asciidoctor } from '@asciidoctor/core';
import { tinyHtmlToAdoc } from '../dom/asciidoctor/html-adoc/tiny-html-to-adoc';
import { adocToTinyHtml } from '../dom/asciidoctor/html-adoc/adoc-to-tiny-html';
import { AdocBuilder } from '../dom/asciidoctor/adoc-builder/adoc-builder';
import { AbstractTranslator } from './abstract-translator';
import { containsChinese } from '../dom/common';
import { buildTranslationPair, TranslationPair } from './translation-pair';
import AbstractNode = Asciidoctor.AbstractNode;
import Table = Asciidoctor.Table;
import Cell = Asciidoctor.Table.Cell;
import Document = Asciidoctor.Document;

export class AdocTranslator extends AbstractTranslator<AbstractNode> {
  private builder = new AdocBuilder();
  readonly inlinePairSeparator = '$$$';

  translateDoc(node: AbstractNode): AbstractNode {
    if (adoc.isAbstractBlock(node)) {
      if (!adoc.isDocument(node)) {
        const [original, translation] = buildTranslationPair(node.getAttribute(`original_title`, ''), node.getTitle());
        this.translateAdoc(original, translation).then(result => {
          if (result && result !== original) {
            node.setTitle(result);
            node.setAttribute(`original_title`, original);
          }
        });
      }
      this.translateAttribute(node, 'title');
      if (adoc.isList(node)) {
        node.getItems().forEach((it) => this.translateDoc(it));
      } else if (adoc.isDescriptionList(node)) {
        node.getItems().flat(9).forEach((it) => this.translateDoc(it));
      } else {
        node.getBlocks().filter(it => it !== node).forEach((it) => this.translateDoc(it));
      }
    }

    if (adoc.hasLines(node) && !['source', 'asciimath', 'literal'].includes(node.getStyle())) {
      const text = node.lines.join('\n').trim();
      if (text && !containsChinese(text)) {
        if (adoc.isListItem(node.getParent())) {
          const [original, translation] = text.split(this.inlinePairSeparator) as TranslationPair;
          this.translateAdoc(original, translation).then(result => {
            if (result && result !== original) {
              node.lines = [original, result].join(this.inlinePairSeparator).split('\n');
            }
          });
        } else if (adoc.isParagraph(node)) {
          const [originalNode, translationNode] = this.buildTranslationPair(node);
          const originalText = originalNode.lines.join('\n');
          const translationText = translationNode.lines.join('\n');
          this.translateAdoc(originalText, translationText).then(result => {
            if (result && result !== originalText) {
              translationNode.lines = result.split('\n');
            } else {
              adoc.removeNode(translationNode);
            }
          });
        } else {
          const lines = text.split(/\n\n+/);
          const pairs: TranslationPair[] = [];
          for (let i = 0; i < lines.length; ++i) {
            const thisLine = lines[i];
            const nextLine = lines[i + 1] ?? '';
            if (!containsChinese(thisLine)) {
              if (containsChinese(nextLine)) {
                pairs.push([thisLine, nextLine]);
              } else {
                pairs.push([thisLine, '']);
              }
            }
          }

          const tasks = pairs.map((pair) => {
            return this.translateAdoc(pair[0], pair[1]).then(result => {
              if (result && result !== pair[0]) {
                pair[1] = result;
              }
            });
          });

          Promise.all(tasks).then(() => {
            node.lines = pairs.map(([original, translation]) => [original, translation].join('\n\n')).join('\n\n').split('\n');
          });
        }
      }
    }

    if (adoc.isDocument(node)) {
      this.translateAttribute(node, 'doctitle');
      this.translateAttribute(node, 'description');
    }

    if (adoc.isQuote(node)) {
      this.translateAttribute(node, 'title');
      this.translateAttribute(node, 'citetitle');
      this.translateAttribute(node, 'attribution');
    }

    if (adoc.isBlockImage(node)) {
      this.translateAttribute(node, 'alt');
    }

    if (adoc.isBlockResource(node)) {
      this.translateAttribute(node, 'poster');
    }

    if (adoc.isTable(node)) {
      const rows = node.getRows();
      this.translateHeadRows(rows.head);
      this.translateRows(rows.body);
      this.translateRows(rows.foot);
    }
    if (adoc.isVerse(node)) {
      this.translateAttribute(node, 'attribution');
      this.translateAttribute(node, 'citetitle');
    }

    if (adoc.isListItem(node)) {
      const text = node.getText().toString();
      const [original, translation] = text.split(this.inlinePairSeparator) as TranslationPair;
      this.translateAdoc(original, translation).then(translation => {
        if (translation && translation !== original) {
          node.setText([original, translation].join(this.inlinePairSeparator));
        }
      });
    }
    return node;
  }

  parse(text: string): Asciidoctor.AbstractNode {
    return this.builder.parse(text);
  }

  serialize(doc: Asciidoctor.AbstractNode): string {
    return this.builder.build(doc as Document);
  }

  async translateAdoc(original: string, translation: string): Promise<string> {
    original = original?.toString();
    if (!original) {
      return '';
    }
    if (containsChinese(original)) {
      return original;
    }
    const sourceHtml = unwrap(adocToTinyHtml(original));
    const translationHtml = translation && unwrap(adocToTinyHtml(translation));
    return await this.translateSentence(sourceHtml, translationHtml, 'html').then(result => {
      return tinyHtmlToAdoc(wrap(result));
    });
  }

  translateAttribute(node: AbstractNode, attributeName: string): void {
    const [original, translation] = buildTranslationPair(
      node.getAttribute(`original_${attributeName}`, ''),
      node.getAttribute(attributeName, ''),
    );
    if (original) {
      this.translateAdoc(original, translation).then(translation => {
        if (translation && original !== translation) {
          node.setAttribute(attributeName, translation);
          node.setAttribute(`original_${attributeName}`, original);
        }
      });
    }
  }

  translateRows(rows: Table.Cell[][]): void {
    rows.map(row => row.map((cell: Cell) => {
      const [original, translation] = cell.getText().toString().split('\n\n');
      this.translateAdoc(original, translation).then(translation => {
        if (translation !== original) {
          cell.style = 'asciidoc';
          cell.text = `${original}\n\n${translation}`;
        }
      });
    }));
  }

  translateHeadRows(rows: Table.Cell[][]): void {
    rows.map(row => row.map((cell: Cell) => {
      if (containsChinese(cell.getText().toString())) {
        return;
      }
      // 标题行不支持 asciidoc 模式，因此只做简单的替换
      this.translateAdoc(cell.text, '').then(translation => {
        if (translation !== cell.text) {
          cell.text = translation;
        }
      });
    }));
  }

  private buildTranslationPair(node: Asciidoctor.Block): [originalNode: Asciidoctor.Block, translationNode: Asciidoctor.Block] {
    const parent = node.getParent() as Asciidoctor.Block;
    const siblings = parent.getBlocks();
    const next = siblings[siblings.indexOf(node) + 1];
    if (next?.lines && containsChinese(next.lines.join('\n'))) {
      return [node, next];
    } else {
      const newNext = adoc.createBlock(parent, 'paragraph');
      newNext.lines = [];
      siblings.splice(siblings.indexOf(node) + 1, 0, newNext);
      return [node, newNext];
    }
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
