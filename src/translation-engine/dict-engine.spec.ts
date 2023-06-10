import { DictTranslationEngine } from './dict-engine';

describe('translation engine', () => {
  it('translate by dict without convert', async () => {
    const engine = new DictTranslationEngine({ dict: 'src/dict/examples/angular' });
    await engine.init();
    for (let i = 0; i < 100; ++i) {
      engine.translate('# One', 'markdown').then(result => {
        expect(result.trim()).toBe('# 一');
      });
    }
    await engine.flush();
  });

  it('translate by dict with convert', async () => {
    const engine = new DictTranslationEngine({ dict: 'src/dict/examples/angular' });
    await engine.init();
    for (let i = 0; i < 100; ++i) {
      engine.translate('<h1>One</h1>', 'html').then(result => {
        expect(result.trim()).toBe('<h1>一</h1>');
      });
    }
    await engine.flush();
  });
});
