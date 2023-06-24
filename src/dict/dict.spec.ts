import { Dict } from './dict';

describe('dict', () => {
  const dict = new Dict();
  beforeAll(async () => {
    await dict.open('src/dict/examples/angular/guide/getting-started.dict.md');
  });
  afterAll(async () => {
  });
  it('获取匹配上的第一个条目', async () => {
    const entry = await dict.get('One');
    expect(entry?.chinese).toEqual('一');
  });
});
