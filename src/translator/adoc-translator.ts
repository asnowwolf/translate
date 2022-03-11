import { TranslationEngine } from '../translation-engine/translation-engine';
import { Adoc } from '../dom/asciidoctor/utils/adoc';
import { Asciidoctor } from '@asciidoctor/core';
import { adocToHtml } from '../dom/asciidoctor/html-adoc/adoc-to-html';
import { htmlToAdoc } from '../dom/asciidoctor/html-adoc/html-to-adoc';
import AbstractNode = Asciidoctor.AbstractNode;
import Cell = Asciidoctor.Table.Cell;

function translateAdoc(engine: TranslationEngine, text: string): Promise<string> {
  const html = adocToHtml(text);
  return engine.translateHtml(html).then(translation => htmlToAdoc(translation));
}

function translateAttribute(engine: TranslationEngine, node: AbstractNode, attributeName: string) {
  const attribute = node.getAttribute(attributeName);
  if (attribute) {
    translateAdoc(engine, attribute).then(translation => translation && node.setAttribute(attributeName, translation));
  }
}

export function adocTranslate(node: AbstractNode, engine: TranslationEngine) {
  if (Adoc.isAbstractBlock(node)) {
    const title = node.getTitle();
    if (title) {
      translateAdoc(engine, title).then(translation => translation && node.setTitle(translation));
    }
    translateAttribute(engine, node, 'title');
    if (Adoc.isList(node)) {
      node.getItems().forEach((it) => adocTranslate(it, engine));
    } else if (Adoc.isDescriptionList(node)) {
      node.getItems().flat(9).forEach((it) => adocTranslate(it, engine));
    } else {
      node.getBlocks().filter(it => it !== node).forEach((it) => adocTranslate(it, engine));
    }
  }
  if (Adoc.isDocument(node)) {
    translateAttribute(engine, node, 'doctitle');
    translateAttribute(engine, node, 'description');
  }
  if (Adoc.isSection(node)) {
    translateAdoc(engine, node.getTitle()).then(translation => node.setTitle(translation));
  }
  if (Adoc.isParagraph(node) || Adoc.isAdmonition(node) || Adoc.isExample(node) || Adoc.isQuote(node)) {
    for (let i = 0; i < node.lines.length; ++i) {
      translateAdoc(engine, node.lines[i]).then(translation => node.lines[i] = translation);
    }
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

  if (Adoc.isTable(node)) {
    const rows = node.getRows();
    [...rows.head, ...rows.body, ...rows.foot].flat(9).forEach((it: Cell) => {
      const html = adocToHtml(it.text);
      engine.translateHtml(html).then(translation => it.text = htmlToAdoc(translation));
    });
  }
}
