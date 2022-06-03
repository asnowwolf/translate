import { AbstractExtractor, SentencePair } from './extractor';
import { HtmlExtractor } from './html-extractor';

export class AngularJsonExtractor extends AbstractExtractor {
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
      if (['title', 'desc', 'tooltip'].includes(key)) {
        return { english: value, chinese: json[`${key}Cn`], format: 'plain' } as SentencePair;
      }
      if (typeof value === 'object') {
        return this.extractProperties(value);
      }
    }).flat(9);
  }
}
