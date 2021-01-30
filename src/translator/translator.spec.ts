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
  it('translate html fragment file', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('a.html', engine);
    const result = await translator.translate('<p>One</p>');

    expect(result).toEqual('<p translation-result="on">One[译]</p><p translation-origin="off">One</p>');
  });
  it('translate ts file', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('placeholder.ts', engine);
    const content = readFileSync('samples/ts/demo.ts', 'utf8');
    const result = await translator.translate(content);
    expect(result).toEqual(readFileSync('samples/ts/demo-translated.ts', 'utf8'));
  });
  it('translate markdown file', async () => {
    const engine = getTranslationEngine(TranslationEngineType.fake);
    const translator = getTranslator('placeholder.md', engine);
    const content = readFileSync('samples/markdown/demo.md', 'utf8');
    const result = await translator.translate(content);
    expect(result).toEqual(readFileSync('samples/markdown/demo-translated.md', 'utf8'));
  });
});
