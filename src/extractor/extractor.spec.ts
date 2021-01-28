import { Extractor } from './extractor';

describe('extractor', () => {
  it('extract pairs from html', async () => {
    const extractor = new Extractor();
    const entries1 = await extractor.extractFile('samples/html/extract1.html');
    expect(entries1).toEqual([
      {
        'chinese': '一',
        'english': 'One',
        'file': 'samples/html/extract1.html',
        'xpath': 'p/1',
      },
      {
        'chinese': '二',
        'english': 'Two',
        'file': 'samples/html/extract1.html',
        'xpath': 'div/2/p/1',
      },
    ]);
    const entries2 = await extractor.extractFile('samples/html/extract2.html');
    expect(entries2).toEqual([
      {
        'chinese': '三',
        'english': 'Three',
        'file': 'samples/html/extract2.html',
        'xpath': 'p/1',
      },
      {
        'chinese': '四',
        'english': 'Four',
        'file': 'samples/html/extract2.html',
        'xpath': 'div/2/p/1',
      },
    ]);
  });
});
