import { HtmlExtractor } from './html-extractor';

describe('html extractor', () => {
  it('extract pairs', () => {
    const extractor = new HtmlExtractor();
    const pairs = extractor.extractSentencePairsFromContent(`<p translation-result="on">译one</p>
<p translation-origin="off">one</p>
`);
    expect(pairs).toEqual([
      {
        'chinese': '译one',
        'english': 'one',
        'format': 'markdown',
      },
    ]);
  });
});
