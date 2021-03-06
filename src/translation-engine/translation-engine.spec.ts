import { GoogleTranslationEngine } from './google-engine';
import { FakeTranslationEngine } from './fake-engine';
import { GoogleCloudTranslationEngine } from './gcloud-engine';

describe('translation engine', function () {
  it('translate one sentence with fake engine', async () => {
    const engine = new FakeTranslationEngine();
    const texts = await engine.translate(['# Hello, world!']);
    expect(texts).toEqual(['# Hello, world![译]']);
  });
  it('translate multi sentences with fake engine with duplicated items', async () => {
    const engine = new FakeTranslationEngine();
    engine.batchSize = 2;
    const texts = await engine.translate([
      'one',
      'two',
      'two',
      'three',
      'one',
    ]);
    expect(texts).toEqual([
      'one[译]',
      'two[译]',
      'two[译]',
      'three[译]',
      'one[译]',
    ]);
  });
  it('translate with google translate', async () => {
    const engine = new GoogleTranslationEngine();
    const texts = await engine.translate(['one', 'two', 'three']);
    expect(texts).toEqual(['一', '二', '三']);
  });

  it('translate with gcloud translate', async () => {
    const engine = new GoogleCloudTranslationEngine({
      parent: 'projects/ralph-gde/locations/us-central1',
      model: 'TRL9199068616738092360',
      glossary: 'angular',
    });
    const texts = await engine.translate(['a`b`c*d*<a href="e">e</a>']);
    expect(texts).toEqual(['a `b` c *d* [e](e)\n']);
  });
});
