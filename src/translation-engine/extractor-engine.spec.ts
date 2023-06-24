import { ExtractorEngine } from './extractor-engine';

describe('extract engine', () => {
  it('extract to dict', async () => {
    const engine = new ExtractorEngine();
    await engine.setup('');
    try {
      for (let i = 0; i < 10; ++i) {
        await engine.translate('# One', '', 'markdown');
        await engine.translate('# Two', '# 二', 'markdown');
      }
    } finally {
      await engine.tearDown();
    }
    expect(engine.entries).toEqual([
      {
        'chinese': '',
        'english': '# One',
      },
      {
        'chinese': '# 二',
        'english': '# Two',
      },
    ]);
  });
});
