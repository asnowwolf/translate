import { TranslationEngineType } from '../common';
import { getTranslator } from './get-translator';
import { readFileSync } from 'fs';
import { getTranslationEngine } from '../translation-engine/get-translation-engine';
import { DomDocument } from '../tiny-dom/dom-models';

describe('file-translator', function () {
  it('translate html file', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('a.html', engine);
    const result = await translator.translate(readFileSync('samples/html/demo.html', 'utf8'));

    const expected = readFileSync('samples/html/demo-translated.html', 'utf8');
    expect(result).toEqual(DomDocument.parse(expected).toHtml());
  });

  it('translate complex html fragment file with noop engine', async () => {
    const engine = getTranslationEngine(TranslationEngineType.noop);
    const translator = getTranslator('a.html', engine);
    const result = await translator.translate(`<li>
  a<a href="/1">One</a>b
  <p>Two</p>
  <p>Three</p>
  <ul>
    <li>Four</li>
  </ul>
</li>`);

    expect(result).toEqual(`<li>
  <p translation-origin="off">a<a href="/1">One</a>b</p>
  <p translation-origin="off">Two</p>
  <p translation-origin="off">Three</p>
  <ul>
    <li>
      <p translation-origin="off">Four</p>
    </li>
  </ul>
</li>`);
  });

  it('translate simple html fragment file with noop engine', async () => {
    const engine = getTranslationEngine(TranslationEngineType.noop);
    const translator = getTranslator('a.html', engine);
    const result = await translator.translate('<p>&#8220;One&mdash;&#8221;</p>');

    expect(result).toEqual('<p translation-origin="off">“One—”</p>');
  });

  it('translate simple html fragment file with fake engine', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('a.html', engine);
    const result = await translator.translate('<p translation-origin="off">One</p>');

    expect(result).toEqual('<p translation-result="on">One译</p><p translation-origin="off">One</p>');
  });

  it('translate complex html fragment file with fake engine', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('a.html', engine);
    const result = await translator.translate(`<li>
  a<a href="/1">One</a>b
  <p>Two</p>
  <p>Three</p>
  <ul>
    <li>Four</li>
  </ul>
</li>`);

    expect(result).toEqual(`<li>
  <p translation-result="on">a<a href="/1">One</a>b译</p>
  <p translation-origin="off">a<a href="/1">One</a>b</p>
  <p translation-result="on">Two译</p>
  <p translation-origin="off">Two</p>
  <p translation-result="on">Three译</p>
  <p translation-origin="off">Three</p>
  <ul>
    <li>
      <p translation-result="on">Four译</p>
      <p translation-origin="off">Four</p>
    </li>
  </ul>
</li>`);
  });

  it('only translate one time', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('a.html', engine);
    const result = await translator.translate(`<li>
<p translation-result="on">One译</p>
<p translation-origin="off">One</p>
</li>`);

    expect(result).toEqual(`<li>
<p translation-result="on">One译</p>
<p translation-origin="off">One</p>
</li>`);
  });

  it('translate ts file', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('placeholder.ts', engine);
    const content = readFileSync('samples/ts/demo.ts', 'utf8');
    const result = await translator.translate(content);
    expect(result).toEqual(readFileSync('samples/ts/demo-translated.ts', 'utf8'));
  });
  it('translate ts file - must includes tag', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('placeholder.ts', engine, { mustIncludesTag: 'publicApi' });
    const result = await translator.translate(`
/**
 * Class1
 * @publicApi
 */
export class Class1 {
  /**
   * foo1
   */
  foo1() {
  }
}

/**
 * Class2
 */
export class Class2 {
  /**
   * foo1
   */
  foo1() {
  }
  /**
   * foo2
   * @publicApi
   */
  foo2() {
  }
}
`);
    expect(result).toEqual(`
/**
 * Class1
 *
 * Class1 译
 *
 * @publicApi
 */
export class Class1 {
  /**
   * foo1
   *
   * foo1 译
   *
   */
  foo1() {
  }
}

/**
 * Class2
 */
export class Class2 {
  /**
   * foo1
   */
  foo1() {
  }
  /**
   * foo2
   *
   * foo2 译
   *
   * @publicApi
   */
  foo2() {
  }
}
`);
  });
  it('translate ts file - must excludes tag', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('placeholder.ts', engine, { mustExcludesTag: 'docs-private' });
    const result = await translator.translate(`
/**
 * Class1
 * @docs-private
 */
export class Class1 {
  /**
   * foo1
   */
  foo1() {
  }
}

/**
 * Class2
 */
export class Class2 {
  /**
   * foo1
   */
  foo1() {
  }
  /**
   * foo2
   * @docs-private
   */
  foo2() {
  }
}
`);
    expect(result).toEqual(`
/**
 * Class1
 * @docs-private
 */
export class Class1 {
  /**
   * foo1
   */
  foo1() {
  }
}

/**
 * Class2
 *
 * Class2 译
 *
 */
export class Class2 {
  /**
   * foo1
   *
   * foo1 译
   *
   */
  foo1() {
  }
  /**
   * foo2
   * @docs-private
   */
  foo2() {
  }
}
`);
  });
  it('translate markdown file', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('placeholder.md', engine);
    const content = readFileSync('samples/markdown/demo.md', 'utf8');
    const result = await translator.translate(content);
    expect(result).toEqual(readFileSync('samples/markdown/demo-translated.md', 'utf8'));
  });
});
