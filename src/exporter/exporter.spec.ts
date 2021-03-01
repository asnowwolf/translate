import { Exporter } from './exporter';

describe('exporter', () => {
  it('export for MS', () => {
    const exporter = new Exporter();
    const result = exporter.export([
      { english: '*one*', chinese: '*一*' },
      { english: '## two', chinese: '## 二' },
    ]);
    expect(result).toEqual([
      { english: 'one', chinese: '一' },
      { english: 'two', chinese: '二' },
    ]);
  });
});
