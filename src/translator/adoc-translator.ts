import { TranslationEngine } from '../translation-engine/translation-engine';
import { Adoc } from '../dom/asciidoctor/utils/adoc';
import { Asciidoctor } from '@asciidoctor/core';
import { tinyHtmlToAdoc } from '../dom/asciidoctor/html-adoc/tiny-html-to-adoc';
import { adocToTinyHtml } from '../dom/asciidoctor/html-adoc/adoc-to-tiny-html';
import { AdocBuilder } from '../dom/asciidoctor/adoc-builder/adoc-builder';
import { Translator } from './translator';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { containsChinese } from '../dom/common';
import AbstractNode = Asciidoctor.AbstractNode;
import Block = Asciidoctor.Block;
import AbstractBlock = Asciidoctor.AbstractBlock;
import Table = Asciidoctor.Table;
import Cell = Asciidoctor.Table.Cell;

async function translateAdoc(engine: TranslationEngine, text: string): Promise<string> {
  if (containsChinese(text)) {
    return text;
  }
  text = text.toString();
  if (!text) {
    return '';
  }
  const html = adocToTinyHtml(text).replace(/\bprop-alt=/g, 'alt=');
  return await engine.translateHtml(html).then(translation => tinyHtmlToAdoc(translation.replace(/\balt=/g, 'prop-alt=')));
}

function translateAttribute(engine: TranslationEngine, node: AbstractNode, attributeName: string): void {
  if (attributeName.startsWith('original_') || node.hasAttribute(`original_${attributeName}`)) {
    return;
  }
  const attribute = node.getAttribute(attributeName);
  if (attribute) {
    translateAdoc(engine, attribute).then(translation => {
      if (translation) {
        node.setAttribute(attributeName, translation);
        if (attribute !== translation) {
          node.setAttribute(`original_${attributeName}`, attribute);
        }
      }
    });
  }
}

function mergeLines(englishLines: string[], chineseLines: string[]): string[] {
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

function hasTranslated(node: Block): boolean {
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

function translateRows(rows: Table.Cell[][], engine: TranslationEngine): void {
  rows.map(row => row.map((cell: Cell) => {
    if (containsChinese(cell.getText())) {
      return;
    }
    cell.style = 'asciidoc';
    translateAdoc(engine, cell.text).then(translation => {
      if (translation !== cell.text) {
        cell.text = `${cell.text}\n\n${translation}`;
      }
    });
  }));
}

function translateHeadRows(rows: Table.Cell[][], engine: TranslationEngine): void {
  rows.map(row => row.map((cell: Cell) => {
    if (containsChinese(cell.getText())) {
      return;
    }
    // 标题行不支持 asciidoc 模式，因此只做简单的替换
    translateAdoc(engine, cell.text).then(translation => {
      if (translation !== cell.text) {
        cell.text = translation;
      }
    });
  }));
}

export function adocDomTranslate(node: AbstractNode, engine: TranslationEngine): void {
  if (Adoc.isAbstractBlock(node)) {
    if (!Adoc.isDocument(node)) {
      const title = node.getTitle();
      if (title && !node.hasAttribute(`original_title`) && !containsChinese(title)) {
        translateAdoc(engine, title).then(translation => {
          if (translation && translation !== title) {
            node.setAttribute(`original_title`, title);
            node.setTitle(translation);
          }
        });
      }
    }
    translateAttribute(engine, node, 'title');
    if (Adoc.isList(node)) {
      node.getItems().forEach((it) => adocDomTranslate(it, engine));
    } else if (Adoc.isDescriptionList(node)) {
      node.getItems().flat(9).forEach((it) => adocDomTranslate(it, engine));
    } else {
      node.getBlocks().filter(it => it !== node).forEach((it) => adocDomTranslate(it, engine));
    }
  }
  if (Adoc.hasLines(node) && !['source', 'asciimath', 'literal'].includes(node.getStyle()) && !hasTranslated(node)) {
    translateAdoc(engine, node.lines.join('\n')).then(translation => {
      const englishLines = node.lines.join('\n').split('\n\n');
      const chineseLines = translation.trim().split('\n\n');
      return node.lines = mergeLines(englishLines, chineseLines);
    });
  }

  if (Adoc.isDocument(node)) {
    translateAttribute(engine, node, 'doctitle');
    translateAttribute(engine, node, 'description');
  }

  if (Adoc.isQuote(node)) {
    translateAttribute(engine, node, 'title');
    translateAttribute(engine, node, 'citetitle');
    translateAttribute(engine, node, 'attribution');
  }

  if (Adoc.isListItem(node)) {
    translateAdoc(engine, node.getText()).then(translation => node.setText(translation));
  }

  if (Adoc.isBlockImage(node)) {
    translateAttribute(engine, node, 'alt');
  }

  if (Adoc.isBlockResource(node)) {
    translateAttribute(engine, node, 'poster');
  }

  if (Adoc.isTable(node)) {
    const rows = node.getRows();
    translateHeadRows(rows.head, engine);
    translateRows(rows.body, engine);
    translateRows(rows.foot, engine);
  }
  if (Adoc.isVerse(node)) {
    translateAttribute(engine, node, 'attribution');
    translateAttribute(engine, node, 'citetitle');
  }
}

export async function adocTranslate(input: string, engine: TranslationEngine = new FakeTranslationEngine()): Promise<string> {
  const builder = new AdocBuilder();
  const dom = builder.parse(input);
  adocDomTranslate(dom, engine);
  await engine.flush();
  return builder.build(dom);
}

export class AdocTranslator extends Translator {
  async translate(text: string): Promise<string> {
    return adocTranslate(text, this.engine);
  }
}
