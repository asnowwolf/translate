import { GoogleTranslationEngine } from './google-engine';
import { FakeTranslationEngine } from './fake-engine';
import { GoogleCloudTranslationEngine } from './gcloud-engine';

describe('translation engine', function () {
  it('translate one sentence with fake engine', async () => {
    const engine = new FakeTranslationEngine();
    const texts = await engine.translate(['# One, Two!']);
    expect(texts).toEqual(['# 一, 二!']);
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
      '一',
      '二',
      '二',
      '三',
      '一',
    ]);
  });
  xit('translate with google translate', async () => {
    const engine = new GoogleTranslationEngine();
    const texts = await engine.translate(['one', 'two', 'three']);
    expect(texts).toEqual(['一', '二', '三']);
  });

  xit('translate with gcloud translate', async () => {
    const engine = new GoogleCloudTranslationEngine({
      parent: 'projects/ralph-gde/locations/us-central1',
      model: 'TRL9199068616738092360',
      glossary: 'angular',
    });
    const texts = await engine.translate(['a`b`c*d*<a href="e">e</a>']);
    expect(texts).toEqual([
      '一个`b` c *d* [e](e)\n',
    ]);
  });
});
