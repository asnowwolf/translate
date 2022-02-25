import { SqliteDict } from './sqlite-dict';
import { v4 } from 'uuid';

describe('dict', () => {
  const dict = new SqliteDict();
  beforeAll(async () => {
    await dict.open(':memory:');
    await dict.createOrUpdate('one', '一');
    await dict.createOrUpdate('two', '二');
    await dict.save({
      id: v4(),
      english: 'three',
      chinese: '三',
      confidence: 'Engine',
      isRegExp: false,
      path: 'path/to/file1.md',
    });
    await dict.save({
      id: v4(),
      english: 'four(\\d+)',
      chinese: '四$1',
      confidence: 'Engine',
      isRegExp: true,
      path: '',
    });
  });
  afterAll(async () => {
    await dict.close();
  });
  it('exactly', async () => {
    const entry = await dict.get('one');
    expect(entry.chinese).toBe('一');
  });
  it('fuzzy', async () => {
    const entry = await dict.get('four1');
    expect(entry.chinese).toBe('四1');
  });
});
