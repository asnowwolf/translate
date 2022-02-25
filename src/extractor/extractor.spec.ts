import { Extractor } from './extractor';
import { pick } from 'lodash';
import { SqliteDict } from '../dict/sqlite-dict';

describe('extractor', () => {
  it('extract pairs from html', async () => {
    const extractor = new Extractor();
    const entries1 = await extractor.extractFile('samples/html/extract1.html');
    expect(entries1.map(it => pick(it, 'chinese', 'english', 'path'))).toEqual([
      {
        'chinese': '# 一',
        'english': '# One',
        'path': 'samples/html/extract1.html',
      },
      {
        'chinese': '二',
        'english': 'Two',
        'path': 'samples/html/extract1.html',
      },
    ]);
    const entries2 = await extractor.extractFile('samples/html/extract2.html');
    expect(entries2.map(it => pick(it, 'chinese', 'english', 'path'))).toEqual([
      {
        'chinese': '三',
        'english': 'Three',
        'path': 'samples/html/extract2.html',
      },
      {
        'chinese': '四',
        'english': 'Four',
        'path': 'samples/html/extract2.html',
      },
    ]);
  });

  it('extract pairs to dict', async () => {
    const extractor = new Extractor();
    const dict = new SqliteDict();
    await dict.open(':memory:');
    await extractor.extractFilesToDict(['samples/html/extract1.html', 'samples/html/extract2.html'], dict);
    const result = await dict.query();
    expect(result.map(it => pick(it, 'chinese', 'english', 'path'))).toEqual([
      {
        'chinese': '# 一',
        'english': '# One',
        'path': 'samples/html/extract1.html',
      },
      {
        'chinese': '二',
        'english': 'Two',
        'path': 'samples/html/extract1.html',
      },
      {
        'chinese': '三',
        'english': 'Three',
        'path': 'samples/html/extract2.html',
      },
      {
        'chinese': '四',
        'english': 'Four',
        'path': 'samples/html/extract2.html',
      },
    ]);
  });
});
