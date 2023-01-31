import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { MarkdownTranslator } from './markdown-translator';
import { readFileSync } from 'fs';
import { NormalizeTranslationEngine } from '../translation-engine/normalize-engine';

describe('markdown-translator', () => {
  it('translate markdown file', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new MarkdownTranslator(engine);
    const content = readFileSync('samples/markdown/demo.md', 'utf8');
    const result = await translator.translateContent(content);
    expect(result).toEqual(readFileSync('samples/markdown/demo-translated.md', 'utf8').trim());
  });
  it('do not duplicate heading when it should not be translated', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new MarkdownTranslator(engine);
    const result = await translator.translateContent(`# no-translate`);
    expect(result).toEqual(`# no-translate`);
  });

  it('translate table', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new MarkdownTranslator(engine);
    const result = await translator.translateContent(`| header1 | header2 |
| :-------- | :------ |
| <header>one</header>two | <code-example>three</code-example><code-example>four</code-example> |`);
    expect(result).toEqual(`| header1                     | header2                                                             |
| :-------------------------- | :------------------------------------------------------------------ |
| 译 header1                   | 译 header2                                                           |
| <header>one</header>two     | <code-example>three</code-example><code-example>four</code-example> |
| <header>译 one</header>译 two | <code-example>three</code-example><code-example>four</code-example> |`);
  });

  it('translate table - no translate', async () => {
    const engine = new NormalizeTranslationEngine();
    const translator = new MarkdownTranslator(engine);
    const result = await translator.translateContent(`| header1 | header2 |
| :-------- | :------ |
| <header>one</header>two | <code-example>three</code-example><code-example>four</code-example> |`);
    expect(result).toEqual(`| header1                 | header2                                                             |
| :---------------------- | :------------------------------------------------------------------ |
| <header>one</header>two | <code-example>three</code-example><code-example>four</code-example> |`);
  });
  it('translate table 2', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new MarkdownTranslator(engine);
    const result = await translator.translateContent(`| one | two |
| :-------- | :------ |
| <header>three</header> <code-example hideCopy format="html" language="html">four</code-example>five<br />six | [seven](eight)<div>ten</div> |
`);
    expect(result).toEqual(`| one                                                                                                               | two                              |
| :---------------------------------------------------------------------------------------------------------------- | :------------------------------- |
| 译 one                                                                                                             | 译 two                            |
| <header>three</header> <code-example hideCopy format="html" language="html">four</code-example>five<br />six      | [seven](eight)<div>ten</div>     |
| <header>译 three</header><code-example hideCopy format="html" language="html">four</code-example>译 five<br />译 six | [译 seven](eight)<div>译 ten</div> |`);
  });
});
