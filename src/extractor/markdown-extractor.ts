import { AbstractExtractor, SentencePair } from './extractor';
import { markdown } from '../dom/unified/markdown';
import { Parent } from 'unist';

export class MarkdownExtractor extends AbstractExtractor<Parent> {
  parse(text: string): Parent {
    return markdown.parse(text);
  }

  async extractSentencePairs(node: Parent): Promise<SentencePair[]> {
    const result: SentencePair[] = [];
    await markdown.visit(node, undefined, async (original, translation) => {
      result.push({
        english: original,
        chinese: translation,
        format: 'markdown',
      });
      return undefined;
    });
    return result;
  }
}
