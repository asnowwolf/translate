import { jsdoc } from './js-doc';
import { FakeTranslator } from './engine';
import { readFileSync } from 'fs';

describe('TS Doc Translation', () => {
  it('translate ts file', async () => {
    const result = await jsdoc.translate(readFileSync('src/test/samples/ts/demo.ts', 'utf8'), new FakeTranslator());
    expect(result).toEqual(readFileSync('src/test/samples/ts/demo-translated.ts', 'utf8'));
  });
});
