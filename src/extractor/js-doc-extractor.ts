import { AbstractExtractor, SentencePair } from './extractor';
import { IndentationText, JSDocTagStructure, Node, OptionalKind, Project } from 'ts-morph';
import { extractPairsFromMarkdown } from './markdown-extractor';
import { markdown } from '../dom/unified/markdown';
import { Parent } from 'mdast';

type VisitorFn = (pairs: SentencePair[]) => void;

export class JsDocExtractor extends AbstractExtractor {
  extractSentencePairsFromContent(js: string): SentencePair[] {
    const project = new Project({ manipulationSettings: { indentationText: IndentationText.TwoSpaces } });
    const source = project.createSourceFile('placeholder.ts', js);
    const result: SentencePair[] = [];
    this.visitForPairs(source, (pairs) => {
      result.push(...pairs);
    });
    return result;
  }

  visitForPairs(node: Node, visitor: VisitorFn): void {
    if (Node.isJSDocable(node)) {
      const docs = node.getJsDocs();
      for (const doc of docs) {
        const structure = doc.getStructure();
        structure.tags.map(tag => this.visitTag(tag, visitor));
        visitor(this.extractMarkdownPairs(structure.description as string));
      }
    }
    const children = Array.from(node.getChildren());
    children.forEach((subNode) => {
      this.visitForPairs(subNode, visitor);
    });
  }

  visitTag(tag: OptionalKind<JSDocTagStructure>, visitor: VisitorFn): void {
    const text = tag.text as string;

    if (isBinaryTag(tag)) {
      const [, , description] = (text ?? '').match(/^((?:{.*?}\s*)?(?:[\w.\[\]]+|\[.*?])\s+)([\s\S]*)$/) ?? [];
      if (description?.trim()) {
        visitor(this.extractMarkdownPairs(description));
      }
    } else if (isUnaryTag(tag)) {
      const [, , description] = (text ?? '').match(/^({.*?}\s*)?([\s\S]*)$/);
      if (description?.trim()) {
        visitor(this.extractMarkdownPairs(description));
      }
    }
  }

  private extractMarkdownPairs(content: string): SentencePair[] {
    content = content.trim();
    if (!content) {
      return [];
    }
    const doc = markdown.parse(content) as Parent;

    return extractPairsFromMarkdown(doc);
  }
}

// 有两个参数且需要翻译的标记，如 @param a Some value
function isBinaryTag(tag: OptionalKind<JSDocTagStructure>): boolean {
  return ['param', 'arg', 'argument', 'property', 'prop', 'yields', 'yield', 'template', 'breaking-change'].includes(tag.tagName);
}

// 有一个参数且需要翻译的标记，如 @returns Some value
function isUnaryTag(tag: OptionalKind<JSDocTagStructure>): boolean {
  return ['returns', 'return', 'classdesc', 'description', 'desc', 'summary', 'throws',
    'deprecated', 'usageNotes', 'see'].includes(tag.tagName);
}
