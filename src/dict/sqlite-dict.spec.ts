import { SqliteDict } from './sqlite-dict';
import { v4 } from 'uuid';

describe('sqlite dict', () => {
  const dict = new SqliteDict();
  beforeAll(async () => {
    await dict.open(':memory:');
    await dict.createOrUpdate('one', '一', 'plain');
    await dict.createOrUpdate('two', '二', 'plain');
    await dict.createOrUpdate('three.', '三。', 'plain');
    await dict.save({
      id: v4(),
      english: 'three',
      fingerprint: 'three',
      chinese: '三',
      confidence: 'Engine',
      isRegExp: false,
      format: 'plain',
      path: 'path/to/file1.md',
    });
    await dict.save({
      id: v4(),
      english: 'four(\\d+)',
      fingerprint: 'four(\\d+)',
      chinese: '四$1',
      confidence: 'Engine',
      format: 'plain',
      isRegExp: true,
      path: '',
    });
  });
  afterAll(async () => {
    await dict.close();
  });
  it('exactly one', async () => {
    const entry = await dict.get('one', 'plain');
    expect(entry.chinese).toBe('一');
  });
  it('exactly three', async () => {
    const entry = await dict.get('three', 'plain');
    expect(entry.chinese).toBe('三');
  });
  it('exactly dot-ended', async () => {
    const entry = await dict.get('one.', 'plain');
    expect(entry.chinese).toBe('一。');
  });
  it('fuzzy', async () => {
    const entry = await dict.get('four1', 'plain');
    expect(entry.chinese).toBe('四1');
  });
  describe('generate fingerprint', () => {
    it('remove last `.` or `。`', async () => {
      const entry = await dict.createOrUpdate('one.', '一。', 'plain');
      expect(entry.english).toEqual('one.');
      expect(entry.fingerprint).toEqual('one');
      expect(entry.chinese).toEqual('一。');
    });
    it('dont remove last `...`', async () => {
      const entry = await dict.createOrUpdate('one...', '一……', 'plain');
      expect(entry.fingerprint).toEqual('one');
    });
    it('replace `\\n` with space', async () => {
      const entry = await dict.createOrUpdate('one\n\n...', '一\n\n……', 'plain');
      expect(entry.fingerprint).toEqual('one');
    });
    it('replace ‘ with \', replace “ with "', async () => {
      const entry = await dict.createOrUpdate('“one”...', '‘一‘……', 'plain');
      expect(entry.fingerprint).toEqual('one');
    });
  });
});
