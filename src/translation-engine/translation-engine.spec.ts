import { FakeTranslationEngine } from './fake-engine';

describe('translation engine', () => {
  it('translate one sentence with fake engine', async () => {
    const engine = new FakeTranslationEngine();
    for (let i = 0; i < 100; ++i) {
      engine.translateMd('# One, Two!').then(result => {
        expect(result.trim()).toBe('# 译One, Two!');
      });
    }
    await engine.flush();
  });
});
