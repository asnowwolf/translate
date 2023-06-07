import { DictTranslationEngine } from './dict-engine';
import { getDict } from '../dict/get-dict';

describe('translation engine', () => {
  it('translate by dict without convert', async () => {
    const engine = new DictTranslationEngine({ dict: ':memory:' });
    await engine.init();
    const dict = engine['dict'];
    await dict.createOrUpdate('One, Two!', '一二', 'plain');
    for (let i = 0; i < 100; ++i) {
      engine.translate('One, Two!', 'plain').then(result => {
        expect(result.trim()).toBe('一二');
      });
    }
    await engine.flush();
  });

  it('translate by dict with convert', async () => {
    const dict = getDict();
    await dict.open(':memory:');
    const engine = new DictTranslationEngine({ dict });
    await engine.init();
    await dict.createOrUpdate('One, Two!', '一二', 'markdown');
    engine.translate('<p>One, Two!</p>', 'html').then(result => {
      expect(result.trim()).toBe(`<p>一二</p>`);
    });
    await engine.flush();
  });
});
