import { Dict } from './dict';

describe('folder dict', () => {
  const dict = new Dict();
  beforeAll(() => {
    dict.open('src/dict/examples/angular');
  });
  afterAll(() => {
    dict.close();
  });
  it('获取匹配上的第一个条目', function () {
    expect(dict.get('# One')?.chinese).toEqual('# 一');
  });
  it('获取匹配上的所有条目，这些条目应该按名称排序，以便让 _common 这样的表只用作最后选择', function () {
    expect(dict.query('# One')).toEqual([
      {
        'chinese': '# 一',
        'confidence': 'Manual',
        'english': '# One',
      },
      {
        'chinese': '# 同级公共翻译',
        'confidence': 'Manual',
        'english': '# One',
      },
      {
        'chinese': '# 顶层公共翻译',
        'confidence': 'Manual',
        'english': '# One',
      },
    ]);
  });
});
