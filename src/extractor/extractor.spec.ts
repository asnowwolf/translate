import { groupBy, omit, uniqBy } from 'lodash';
import { getExtractorFor } from './get-extractor-for';
import { getDict } from '../dict/get-dict';

describe('extractor', () => {
  it('extract pairs from html', () => {
    const filename1 = 'samples/html/extract1.html';
    const extractor = getExtractorFor(filename1);
    const entries1 = extractor.extract(filename1);
    expect(entries1.map(it => omit(it, 'id', 'isRegExp'))).toEqual([
      {
        'chinese': '一',
        'confidence': 'Manual',
        'english': 'One',
        'format': 'markdown',
        'path': 'samples/html/extract1.html',
      },
      {
        'chinese': '二',
        'confidence': 'Manual',
        'english': 'Two',
        'format': 'markdown',
        'path': 'samples/html/extract1.html',
      },
    ]);
    const filename2 = 'samples/html/extract2.html';
    const entries2 = extractor.extract(filename2);
    expect(entries2.map(it => omit(it, 'id', 'isRegExp'))).toEqual([
      {
        'chinese': '三',
        'confidence': 'Manual',
        'english': 'Three',
        'format': 'markdown',
        'path': 'samples/html/extract2.html',
      },
      {
        'chinese': '四',
        'confidence': 'Manual',
        'english': 'Four',
        'format': 'markdown',
        'path': 'samples/html/extract2.html',
      },
    ]);
  });

  it('extract pairs to dict', async () => {
    const filename1 = 'samples/html/extract1.html';
    const filename2 = 'samples/html/extract2.html';
    const extractor = getExtractorFor(filename1);
    const dict = getDict();
    await dict.open('src/dict/examples/test');
    const allPairs = [filename1, filename2].map(file => extractor.extract(file).map(it => {
      return {
        ...it,
        path: file,
      };
    })).flat()
      .filter(it => /.*/.test(it.english) || /.*/.test(it.chinese));
    const pairs = uniqBy(allPairs, (it) => it.english + it.chinese);
    const groups = groupBy(pairs, it => it.path);
    for (const [file, pairs] of Object.entries(groups)) {
      for (const pair of pairs) {
        await dict.save(file, pair);
      }
    }
    const result = dict.query();
    expect(result.map(it => omit(it, 'id', 'isRegExp', 'createdAt', 'updatedAt'))).toEqual([
      {
        'chinese': '一',
        'confidence': 'Manual',
        'english': 'One',
        'path': 'samples/html/extract1.html',
      },
      {
        'chinese': '二',
        'confidence': 'Manual',
        'english': 'Two',
        'path': 'samples/html/extract1.html',
      },
      {
        'chinese': '三',
        'confidence': 'Manual',
        'english': 'Three',
        'path': 'samples/html/extract2.html',
      },
      {
        'chinese': '四',
        'confidence': 'Manual',
        'english': 'Four',
        'path': 'samples/html/extract2.html',
      },
    ]);
  });
});
