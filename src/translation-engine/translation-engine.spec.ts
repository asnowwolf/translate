import { FakeTranslationEngine } from './fake-engine';

describe('translation engine', () => {
  it('translate one sentence with fake engine', async () => {
    const engine = new FakeTranslationEngine();
    for (let i = 0; i < 100; ++i) {
      engine.translateHtml('# One, Two!').then(result => {
        expect(result).toBe('# 一, 二!');
      });
    }
    await engine.flush();
  });
});
