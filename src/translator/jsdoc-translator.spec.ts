import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { JsdocTranslator } from './jsdoc-translator';
import { readFileSync } from 'fs';

describe('jsdoc-translator', () => {
  it('translate ts file', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new JsdocTranslator(engine);
    const content = readFileSync('samples/ts/demo.ts', 'utf8');
    const result = await translator.translateContent(content);
    expect(result).toEqual(readFileSync('samples/ts/demo-translated.ts', 'utf8'));
  });
  it('translate ts file - must includes tag', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new JsdocTranslator(engine);
    const result = await translator.translateContent(`
/**
 * Class One
 * @publicApi
 */
export class Class1 {
  /**
   * two
   */
  foo1() {
  }

  /** three */
  private foo2() {
  }
}

/**
 * Class Two
 */
export class Class2 {
  /**
   * three
   */
  foo1() {
  }
  /**
   * four
   * @publicApi
   */
  foo2() {
  }
}
`, { mustIncludesTags: ['publicApi'] });
    expect(result).toEqual(`
/**
 * Class One
 *
 * 译 Class One
 *
 * @publicApi
 */
export class Class1 {
  /**
   * two
   *
   * 译 two
   *
   */
  foo1() {
  }

  /** three */
  private foo2() {
  }
}

/**
 * Class Two
 */
export class Class2 {
  /**
   * three
   */
  foo1() {
  }
  /**
   * four
   *
   * 译 four
   *
   * @publicApi
   */
  foo2() {
  }
}
`);
  });
  it('translate ts file - must excludes tag', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new JsdocTranslator(engine);
    const result = await translator.translateContent(`
/**
 * Class One
 * @docs-private
 */
export class Class1 {
  /**
   * two
   */
  foo1() {
  }
}

/**
 * Class Two
 */
export class Class2 {
  /**
   * three
   */
  foo1() {
  }
  /**
   * four
   * @docs-private
   */
  foo2() {
  }
}
`, { mustExcludesTags: ['docs-private'] });
    expect(result).toEqual(`
/**
 * Class One
 * @docs-private
 */
export class Class1 {
  /**
   * two
   */
  foo1() {
  }
}

/**
 * Class Two
 *
 * 译 Class Two
 *
 */
export class Class2 {
  /**
   * three
   *
   * 译 three
   *
   */
  foo1() {
  }
  /**
   * four
   * @docs-private
   */
  foo2() {
  }
}
`);
  });

  it('```识别为单独的注释', async () => {
    const js = `
/**
 * \`\`\`typescript
 * @Component({
 *   selector: "my-component",
 *   templateUrl: "my-component-tpl.html",
 *   animations: [
 *     trigger("myAnimationTrigger", [
 *       state(...),
 *       state(...),
 *       transition(...),
 *       transition(...)
 *     ])
 *   ]
 * })
 * class MyComponent {
 *   myStatusExp = "something";
 * }
 * \`\`\`
 */
class A {}
`;
    const engine = new FakeTranslationEngine();
    const translator = new JsdocTranslator(engine);
    const result = await translator.translateContent(js);
    expect(result).toEqual(js);
  });

  it('@example', async () => {
    const js = `
/**
 * Some Text
 *
 * @usageNotes
 * {@example path/to/file region='name'}
 */
class A {}
`;
    const expected = `
/**
 * Some Text
 *
 * 译 Some Text
 *
 * @usageNotes
 *
 * {@example path/to/file region='name'}
 *
 * 译{@example path/to/file region='name'}
 *
 */
class A {}
`;
    const engine = new FakeTranslationEngine();
    const translator = new JsdocTranslator(engine);
    const result = await translator.translateContent(js);
    expect(result).toEqual(expected);
  });
});
