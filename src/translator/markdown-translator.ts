import { AbstractTranslator } from './abstract-translator';
import { Node, Parent } from 'unist';
import { markdown } from '../dom/unified/markdown';

export class MarkdownTranslator extends AbstractTranslator<Node> {
  parse(text: string): Node {
    return markdown.parse(text);
  }

  serialize(doc: Node): string {
    return prettify(markdown.stringify(doc));
  }

  translateDoc(doc: Parent): Node {
    markdown.visit(doc, undefined, async (original, translation) => {
      if (!translation) {
        return this.translateSentence(original, 'markdown');
      } else {
        return undefined;
      }
    });
    return doc;
  }
}

function prettify(md: string): string {
  return md
    .replace(/([\w`])([\u4e00-\u9fa5])/g, '$1 $2')
    .replace(/([\u4e00-\u9fa5])([\w`])/g, '$1 $2')
    .replace(/\n\n+/g, '\n\n');
}
