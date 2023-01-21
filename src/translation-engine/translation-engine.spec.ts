import { FakeTranslationEngine } from './fake-engine';

describe('translation engine', () => {
  it('translate one sentence with fake engine in buffer mode', async () => {
    const engine = new FakeTranslationEngine();
    for (let i = 0; i < 100; ++i) {
      engine.translate('One, Two!', 'plain').then(result => {
        expect(result.trim()).toBe('译One, Two!');
        expect(engine.totalBytes).toBeGreaterThan(0);
      });
    }
    await engine.flush();
  });

  it('should not translate url', async () => {
    const engine = new FakeTranslationEngine();
    engine.translate('http://www.google.com', 'plain').then(result => {
      expect(result).toBe('http://www.google.com');
      expect(engine.totalBytes).toBe(0);
    });
    await engine.flush();
  });
});
