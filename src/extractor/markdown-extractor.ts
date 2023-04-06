import { AbstractExtractor, SentencePair } from './extractor';
import { Parent } from 'mdast';
import { markdown } from '../dom/unified/markdown';

export class MarkdownExtractor extends AbstractExtractor {
  extractSentencePairsFromContent(content: string): SentencePair[] {
    const doc = markdown.parse(content) as Parent;
    return extractPairsFromMarkdown(doc);
  }
}

export function extractPairsFromMarkdown(node: Parent): SentencePair[] {
  const result: SentencePair[] = [];
  for (let i = 0; i < node?.children?.length; i++) {
    const current = node.children[i];
    const next = node.children[i + 1];
    if (next && current.type === next.type &&
      markdown.isTranslatableUnit(current) && !markdown.nodeContainsChinese(current) && markdown.nodeContainsChinese(next)) {
      result.push({
        english: markdown.stringify(current),
        chinese: markdown.stringify(next),
        format: 'markdown',
      });
    } else if (next && markdown.isTableRow(current) && markdown.isTableRow(next) && current.children.length === next.children.length &&
      !markdown.nodeContainsChinese(current) && markdown.nodeContainsChinese(next)) {
      for (let col = 0; col < current.children.length; ++col) {
        result.push({
          english: markdown.stringify(current.children[col]),
          chinese: markdown.stringify(next.children[col]),
          format: 'markdown',
        });
      }
    } else {
      result.push(...extractPairsFromMarkdown(current as Parent));
    }
  }
  return result;
}
