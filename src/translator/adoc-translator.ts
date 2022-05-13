import { TranslationEngine } from '../translation-engine/translation-engine';
import { Adoc } from '../dom/asciidoctor/utils/adoc';
import { Asciidoctor } from '@asciidoctor/core';
import { tinyHtmlToAdoc } from '../dom/asciidoctor/html-adoc/tiny-html-to-adoc';
import { adocToTinyHtml } from '../dom/asciidoctor/html-adoc/adoc-to-tiny-html';
import { AdocBuilder } from '../dom/asciidoctor/adoc-builder/adoc-builder';
import { Translator } from './translator';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import AbstractNode = Asciidoctor.AbstractNode;
import Cell = Asciidoctor.Table.Cell;

function translateAdoc(engine: TranslationEngine, text: string): Promise<string> {
  text = text.toString();
  if (!text) {
    return Promise.resolve('');
  }
  const html = adocToTinyHtml(text).replace(/\bprop-alt=/g, 'alt=');
  return engine.translateHtml(html).then(translation => tinyHtmlToAdoc(translation.replace(/\balt=/g, 'prop-alt=')));
}

function translateAttribute(engine: TranslationEngine, node: AbstractNode, attributeName: string) {
  const attribute = node.getAttribute(attributeName);
  if (attribute) {
    translateAdoc(engine, attribute).then(translation => translation && node.setAttribute(attributeName, translation));
  }
}

export function adocDomTranslate(node: AbstractNode, engine: TranslationEngine): void {
  if (Adoc.isAbstractBlock(node)) {
    const title = node.getTitle();
    if (title) {
      translateAdoc(engine, title).then(translation => translation && node.setTitle(translation));
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
  if (Adoc.isDocument(node)) {
    translateAttribute(engine, node, 'doctitle');
    translateAttribute(engine, node, 'description');
  }
  if (Adoc.isSection(node)) {
    translateAdoc(engine, node.getTitle()).then(translation => node.setTitle(translation));
  }
  if (Adoc.isParagraph(node) || Adoc.isAdmonition(node) || Adoc.isExample(node) || Adoc.isQuote(node) ||
    Adoc.isSidebar(node) || Adoc.isVerse(node) || Adoc.isListing(node) && node.getStyle() !== 'source') {
    translateAdoc(engine, node.lines.join('\n')).then(translation => node.lines = translation?.split('\n'));
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
    [...rows.head, ...rows.body, ...rows.foot].flat(9).forEach((it: Cell) => {
      if (it.getStyle() === 'asciidoc') {
        translateAdoc(engine, it.text).then(translation => it.text = translation);
      } else {
        engine.translateHtml(it.text).then(translation => it.text = translation);
      }
    });
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
