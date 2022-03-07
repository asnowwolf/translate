import { AdocBuilder } from '../dom/asciidoctor/adoc-builder/adoc-builder';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { adocTranslate } from './adoc-translator';

async function rebuild(input: string): Promise<string> {
  const builder = new AdocBuilder();
  const dom = builder.parse(input);
  const engine = new FakeTranslationEngine();
  adocTranslate(dom, engine);
  await engine.flush();
  return builder.build(dom);
}

describe('adoc-translator', () => {
  it('document', async () => {
    const input = `= One: Subtitle for One
:description: Description for "One"`;
    const output = await rebuild(input);
    expect(output).toBe(`= 一: Subtitle for 一
:description: Description for "一"`);
  });
  it('section', async () => {
    const input = `== One`;
    const output = await rebuild(input);
    expect(output).toBe(`== 一`);
  });
  it('section with title', async () => {
    const input = `.One
== Two`;
    const output = await rebuild(input);
    expect(output).toBe(`.一
== 二`);
  });
  xit('indexterm', async () => {
    const input = `I, King Arthur.
(((One, "Two, Three")))`;
    const output = await rebuild(input);
    expect(output).toBe(`I, King Arthur.
(((一, "二, 三")))`);
  });
  it('unordered list', async () => {
    const input = `* [ ] One
** One-Two
* [x] Three`;
    const output = await rebuild(input);
    expect(output).toEqual(`* [ ] 一
** 一-二
* [x] 三`);
  });
  it('description lists', async () => {
    const input = `One:: Description for One.
Two:: Description for Two.`;
    const output = await rebuild(input);
    expect(output).toEqual(`一:: Description for 一.
二:: Description for 二.`);
  });
  describe('text formats', () => {
    it('simple', async () => {
      const content = `*one* _two_ \`three\` #four# ~five~ ^six^ **seven eight**`;
      const input = await rebuild(content);
      expect(input).toEqual(`*一* _二_ \`三\` #四# ~五~ ^六^ *七 八*`);
    });

    it('mixed', async () => {
      const content = '`*_one two_*` & ``*__three__*``four``*__five__*``';
      expect(await rebuild(content)).toEqual('`*_一 二_*` & `*_三_*`四`*_五_*`');
    });

    it('literal monospace', async () => {
      const content = '`One` is one';
      expect(await rebuild(content)).toEqual(content);
    });

    it('text span', async () => {
      const content = `One [.two]#Three#`;
      expect(await rebuild(content)).toEqual(content);
    });
  });
});
