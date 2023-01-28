import { GoogleTranslationEngine } from './google-engine';

describe('goog engine', () => {
  it('should translate by google', async () => {
    const engine = new GoogleTranslationEngine();
    engine.translate(`\`abc\`! this is a word!`, 'markdown').then(result => {
      expect(result).toBe(`\`String\`的\`Into<Vec<u8>>\`的实现只是获取\`String\`的堆缓冲区并将其重新用作返回向量的元素缓冲区，保持不变。转换不需要分配或复制文本。这是移动实现高效实施的另一种情况。`);
    });
    await engine.flush();
  });
});
