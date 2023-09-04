import { FakeTranslationEngine } from './fake-engine';

describe('translation engine', () => {
  it('translate one sentence with fake engine in buffer mode', async () => {
    const engine = new FakeTranslationEngine();
    for (let i = 0; i < 100; ++i) {
      engine.translate('One, Two!', '', 'plain').then(result => {
        expect(result.trim()).toBe('译One, Two!');
        expect(engine.totalBytes).toBeGreaterThan(0);
      });
    }
    await engine.flush();
  });

  it('should not translate url', async () => {
    const engine = new FakeTranslationEngine();
    engine.translate('http://www.google.com', '', 'plain').then(result => {
      expect(result).toBe('http://www.google.com');
      expect(engine.totalBytes).toBe(0);
    });
    await engine.flush();
  });

  it('should not translate angular/number/string', async () => {
    const engine = new FakeTranslationEngine();
    engine.translate('angular', '', 'plain').then(result => {
      expect(result).toBe('angular');
      expect(engine.totalBytes).toBe(0);
    });
    engine.translate('number', '', 'plain').then(result => {
      expect(result).toBe('number');
      expect(engine.totalBytes).toBe(0);
    });
    engine.translate('string', '', 'plain').then(result => {
      expect(result).toBe('string');
      expect(engine.totalBytes).toBe(0);
    });
    await engine.flush();
  });
  it('should translate text that contains url', async () => {
    const engine = new FakeTranslationEngine();
    engine.translate('Hello, this is http://www.google.com', '', 'plain').then(result => {
      expect(result).toBe('译Hello, this is http://www.google.com');
      expect(engine.totalBytes).toBe(36);
    });
    await engine.flush();
  });
});
