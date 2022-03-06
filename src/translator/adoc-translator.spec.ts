import { AdocBuilder } from '../dom/asciidoctor/adoc-builder/adoc-builder';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { TranslationEngine } from '../translation-engine/translation-engine';
import { Asciidoctor } from '@asciidoctor/core';
import { Adoc } from '../dom/asciidoctor/utils/adoc';
import AbstractNode = Asciidoctor.AbstractNode;

function translateAttribute(engine: TranslationEngine, node: AbstractNode, attributeName: string) {
  const attribute = node.getAttribute(attributeName);
  if (attribute) {
    engine.translateHtml(attribute).then(translation => translation && node.setAttribute(attributeName, translation));
  }
}

function adocTranslate(dom: AbstractNode, engine: TranslationEngine) {
  if (Adoc.isAbstractBlock(dom)) {
    const title = dom.getTitle();
    if (title) {
      engine.translateHtml(title).then(translation => translation && dom.setTitle(translation));
    }
    dom.getBlocks().filter(it => it !== dom).forEach((it) => adocTranslate(it, engine));
  }
  if (Adoc.isIndexTerm(dom)) {
    translateAttribute(engine, dom, 'terms');
  }
  if (Adoc.isDocument(dom)) {
    translateAttribute(engine, dom, 'doctitle');
    translateAttribute(engine, dom, 'description');
  }
  if (Adoc.isSection(dom)) {
    engine.translateHtml(dom.getTitle()).then(translation => dom.setTitle(translation));
  }
  if (Adoc.isParagraph(dom)) {
    for (let i = 0; i < dom.lines.length; ++i) {
      engine.translateHtml(dom.lines[i]).then(translation => dom.lines[i] = translation);
    }
  }
}

describe('adoc-translator', () => {
  it('document/section/paragraph', async () => {
    const input = `= One: Subtitle for One
:description: Description for "One"

== Two

Three`;
    const builder = new AdocBuilder();
    const dom = builder.parse(input);
    const engine = new FakeTranslationEngine();
    adocTranslate(dom, engine);
    await engine.flush();
    const output = builder.build(dom);
    expect(output).toBe(`= 一: Subtitle for 一
:description: Description for "一"

== 二

三`);
  });
  it('indexterm', async () => {
    const input = `I, King Arthur.
(((knight, "Arthur, King")))`;
    const compiler = new AdocBuilder();
    const dom = compiler.parse(input);
    const engine = new FakeTranslationEngine();
    adocTranslate(dom, engine);
    await engine.flush();
    const output = compiler.build(dom);
    expect(output).toBe(`I, King Arthur.
(((knight, "Arthur, King")))`);
  });
});
