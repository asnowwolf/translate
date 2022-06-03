import { AdocExtractor } from './adoc-extractor';
import { Examples } from '../dom/asciidoctor/utils/examples';

describe('asciidoctor extractor', () => {
  it('extract from attributes and paragraphs', () => {
    const extractor = new AdocExtractor();
    const pairs = extractor.extractSentencePairsFromContent(Examples.documentWithPreambleAdocCn);
    expect(pairs).toEqual([
      {
        'chinese': '译Document Title',
        'english': 'Document Title',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Preamble paragraph',
        'english': 'Preamble paragraph',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Section title',
        'english': 'Section title',
        'format': 'asciidoctor',
      },
    ]);
  });
  it('extract from lines', () => {
    const extractor = new AdocExtractor();
    const pairs = extractor.extractSentencePairsFromContent(Examples.admonitionSimpleAdocCn);
    expect(pairs).toEqual([
      {
        'chinese': '译abc',
        'english': 'abc',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Wolpertingers are known to nest in server racks.\n译Enter at your own risk.',
        'english': 'Wolpertingers are known to nest in server racks.\nEnter at your own risk.',
        'format': 'asciidoctor',
      },
    ]);
  });

  it('extract from table', () => {
    const extractor = new AdocExtractor();
    const pairs = extractor.extractSentencePairsFromContent(Examples.tableColSpanAndRowSpanAdocCn);
    expect(pairs).toEqual([
      {
        'chinese': '译Cell in column 1, row 2',
        'english': 'Cell in column 1, row 2',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译This cell spans columns 2 and 3 and rows 2, 3, and 4 because its specifier contains a span of 2.3+',
        'english': 'This cell spans columns 2 and 3 and rows 2, 3, and 4 because its specifier contains a span of 2.3+',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Cell in column 4, row 2',
        'english': 'Cell in column 4, row 2',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Cell in column 1, row 3',
        'english': 'Cell in column 1, row 3',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Cell in column 4, row 3',
        'english': 'Cell in column 4, row 3',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Cell in column 1, row 4',
        'english': 'Cell in column 1, row 4',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Cell in column 4, row 4',
        'english': 'Cell in column 4, row 4',
        'format': 'asciidoctor',
      },
    ]);
  });
  it('extract from list', () => {
    const extractor = new AdocExtractor();
    const pairs = extractor.extractSentencePairsFromContent(`Dairy::
* Milk$$$译Milk
* Eggs
Bakery$$$译Bakery::
* Bread$$$译Bread
Produce$$$译Produce::
* Bananas$$$译Bananas`);
    expect(pairs).toEqual([
      {
        'chinese': '译Milk',
        'english': 'Milk',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Bakery',
        'english': 'Bakery',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Bread',
        'english': 'Bread',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Produce',
        'english': 'Produce',
        'format': 'asciidoctor',
      },
      {
        'chinese': '译Bananas',
        'english': 'Bananas',
        'format': 'asciidoctor',
      },
    ]);
  });
});
