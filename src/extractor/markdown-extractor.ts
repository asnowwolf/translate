import { AbstractExtractor, SentencePair } from './extractor';
import { Parent } from 'mdast';
import { Md } from '../dom/unified/md';

export class MarkdownExtractor extends AbstractExtractor {
  extractSentencePairsFromContent(content: string): SentencePair[] {
    const doc = Md.parse(content) as Parent;
    return this.extractPairs(doc);
  }

  private extractPairs(node: Parent): SentencePair[] {
    const result: SentencePair[] = [];
    for (let i = 0; i < node?.children?.length; i++) {
      const current = node.children[i];
      const next = node.children[i + 1];
      if (next && current.type === next.type &&
        Md.isTranslatableUnit(current) && !Md.containsChinese(current) && Md.containsChinese(next)) {
        result.push({
          english: Md.stringify(current),
          chinese: Md.stringify(next),
          format: 'markdown',
        });
      } else if (next && Md.isTableRow(current) && Md.isTableRow(next) && current.children.length === next.children.length &&
        !Md.containsChinese(current) && Md.containsChinese(next)) {
        for (let col = 0; col < current.children.length; ++col) {
          result.push({
            english: Md.stringify(current.children[col]),
            chinese: Md.stringify(next.children[col]),
            format: 'markdown',
          });
        }
      } else {
        result.push(...this.extractPairs(current as Parent));
      }
    }
    return result;
  }
}
