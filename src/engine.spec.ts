import { describe, it } from 'mocha';
import { expect } from 'chai';
import { FakeTranslator, GoogleTranslator } from './engine';

describe('translation engine', function () {
  it('translate one sentence with fake engine', async () => {
    const engine = new FakeTranslator();
    const texts = await engine.translate(['<h1>Hello, world!</h1>']);
    expect(texts).eql(['<h1>译Hello, world!</h1>']);
  });
  it('translate multi sentences with fake engine', async () => {
    const engine = new FakeTranslator();
    const texts = await engine.translate(['one', 'two', 'three']);
    expect(texts).eql(['[译]one', '[译]two', '[译]three']);
  });
  it('translate with google translate', async () => {
    const engine = new GoogleTranslator();
    const texts = await engine.translate(['one', 'two', 'three']);
    expect(texts).eql(['一', '二', '三']);
  });
});
