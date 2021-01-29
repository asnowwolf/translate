import { Extractor } from './extractor';
import { Dict } from '../dict/dict';

describe('extractor', () => {
  it('extract pairs from html', async () => {
    const extractor = new Extractor();
    const entries1 = await extractor.extractFile('samples/html/extract1.html');
    expect(entries1).toEqual([
      {
        'chinese': '# 一',
        'english': '# One',
        'file': 'samples/html/extract1.html',
        'xpath': 'h1/1',
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

  it('extract pairs to dict', async () => {
    const extractor = new Extractor();
    const dict = new Dict();
    await dict.openInMemory();
    await extractor.extractFilesToDict(['samples/html/extract1.html', 'samples/html/extract2.html'], dict);
    const result = await dict.findAll({ select: ['id', 'chinese', 'english', 'filename', 'path', 'xpath'] });
    expect(result).toEqual([
      {
        'chinese': '# 一',
        'english': '# One',
        'filename': 'extract1.html',
        'id': 1,
        'path': 'samples/html/extract1.html',
        'xpath': 'h1/1',
      },
      {
        'chinese': '二',
        'english': 'Two',
        'filename': 'extract1.html',
        'id': 2,
        'path': 'samples/html/extract1.html',
        'xpath': 'div/2/p/1',
      },
      {
        'chinese': '三',
        'english': 'Three',
        'filename': 'extract2.html',
        'id': 3,
        'path': 'samples/html/extract2.html',
        'xpath': 'p/1',
      },
      {
        'chinese': '四',
        'english': 'Four',
        'filename': 'extract2.html',
        'id': 4,
        'path': 'samples/html/extract2.html',
        'xpath': 'div/2/p/1',
      },
    ]);
  });
});
