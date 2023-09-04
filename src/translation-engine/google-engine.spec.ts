import { GoogleTranslationEngine } from './google-engine';

describe('goog engine', () => {
  it('should translate by google', async () => {
    const engine = new GoogleTranslationEngine();
    engine.translate(`\`abc\`! this is a word!`, '', 'markdown').then(result => {
      expect(result).toBe(`\`abc\` ！ 这是一句话！`);
    });
    await engine.flush();
  });
});
