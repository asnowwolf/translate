import { Extractor } from './extractor';
import { pick } from 'lodash';
import { SqliteDict } from '../dict/sqlite-dict';

describe('extractor', () => {
  it('extract pairs from html', async () => {
    const extractor = new Extractor();
    const entries1 = await extractor.extractFile('samples/html/extract1.html');
    expect(entries1).toEqual([
      {
        'chinese': '# 一',
        'english': '# One',
        'file': 'samples/html/extract1.html',
      },
      {
        'chinese': '二',
        'english': 'Two',
        'file': 'samples/html/extract1.html',
      },
    ]);
    const entries2 = await extractor.extractFile('samples/html/extract2.html');
    expect(entries2).toEqual([
      {
        'chinese': '三',
        'english': 'Three',
        'file': 'samples/html/extract2.html',
      },
      {
        'chinese': '四',
        'english': 'Four',
        'file': 'samples/html/extract2.html',
      },
    ]);
  });

  it('extract pairs to dict', async () => {
    const extractor = new Extractor();
    const dict = new SqliteDict();
    await dict.open(':memory:');
    await extractor.extractFilesToDict(['samples/html/extract1.html', 'samples/html/extract2.html'], dict);
    const result = await dict.query();
    expect(result.map(it => pick(it, 'id', 'chinese', 'english', 'filename', 'path', 'isRegExp'))).toEqual([
      {
        'chinese': '# 一',
        'english': '# One',
        'filename': 'extract1.html',
        'id': 1,
        'isRegExp': false,
        'path': 'samples/html/extract1.html',
      },
      {
        'chinese': '二',
        'english': 'Two',
        'filename': 'extract1.html',
        'id': 2,
        'isRegExp': false,
        'path': 'samples/html/extract1.html',
      },
      {
        'chinese': '三',
        'english': 'Three',
        'filename': 'extract2.html',
        'id': 3,
        'isRegExp': false,
        'path': 'samples/html/extract2.html',
      },
      {
        'chinese': '四',
        'english': 'Four',
        'filename': 'extract2.html',
        'id': 4,
        'isRegExp': false,
        'path': 'samples/html/extract2.html',
      },
    ]);
  });
});
