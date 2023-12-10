import { JsonTranslator } from './json-translator';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { readFileSync } from 'fs';

describe('json-translator', () => {
  it('translate it', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new JsonTranslator(engine);
    const original = readFileSync('samples/json/demo.json', 'utf8');
    const translation = await translator.translateContentAndFlushStandalone(original, { jsonProperties: ['b', 'd'] });
    await translator.flush();
    expect(translation).toEqual(readFileSync('samples/json/demo-translated.json', 'utf8').trim());
  });
});
