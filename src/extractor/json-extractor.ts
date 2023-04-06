import { AbstractExtractor, SentencePair } from './extractor';
import { HtmlExtractor } from './html-extractor';

export class JsonExtractor extends AbstractExtractor {
  private htmlExtractor = new HtmlExtractor();

  extractSentencePairsFromContent(content: string): SentencePair[] {
    const json = JSON.parse(content);
    return [
      ...this.htmlExtractor.extractSentencePairsFromContent(json.contents),
      ...this.extractProperties(json),
    ].filter(it => !!it);
  }

  extractProperties(json: object): SentencePair[] {
    return Object.entries(json).map(([key, value]) => {
      if (key.endsWith('Cn')) {
        const englishValue = json[key.replace(/^(.*)Cn$/, '$1')];
        if (typeof englishValue === 'string') {
          return { english: englishValue, chinese: value, format: 'plain' } as SentencePair;
        }
      }
      if (typeof value === 'object') {
        return this.extractProperties(value);
      }
    }).flat(9);
  }
}
