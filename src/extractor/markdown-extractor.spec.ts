import { MarkdownExtractor } from './markdown-extractor';
import { markdown } from '../dom/unified/markdown';

describe('markdown extractor', () => {
  it('extract pairs - simple', async () => {
    const extractor = new MarkdownExtractor();
    const pairs = await extractor.extractSentencePairs(markdown.parse(`# One
# 一

two

二
`));
    expect(pairs).toEqual([
      {
        'chinese': '一',
        'english': 'One',
        'format': 'markdown',
      },
      {
        'chinese': '二',
        'english': 'two',
        'format': 'markdown',
      },
    ]);
  });
  it('extract pairs - complex', async () => {
    const extractor = new MarkdownExtractor();
    const pairs = await extractor.extractSentencePairs(markdown.parse(`| One 11 | One 12 |
| ------ | ------ |
| 译 One 11 | 译 One 12 |
| Two 11 | Two 12 |
| 译 Two 11 | 译 Two 12 |
| no-translate | Two 12 |
| no-translate | 译 Two 12 |
| Three 11 | Three 12 |
| 译 Three 11 | 译 Three 12 |
`));
    expect(pairs).toEqual([
      {
        'chinese': '译 Three 11',
        'english': 'Three 11',
        'format': 'markdown',
      },
      {
        'chinese': '译 Three 12',
        'english': 'Three 12',
        'format': 'markdown',
      },
      {
        'chinese': 'no-translate',
        'english': 'no-translate',
        'format': 'markdown',
      },
      {
        'chinese': '译 Two 12',
        'english': 'Two 12',
        'format': 'markdown',
      },
      {
        'chinese': '译 Two 11',
        'english': 'Two 11',
        'format': 'markdown',
      },
      {
        'chinese': '译 Two 12',
        'english': 'Two 12',
        'format': 'markdown',
      },
      {
        'chinese': '译 One 11',
        'english': 'One 11',
        'format': 'markdown',
      },
      {
        'chinese': '译 One 12',
        'english': 'One 12',
        'format': 'markdown',
      },
    ]);
  });
});
