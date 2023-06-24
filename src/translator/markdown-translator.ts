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
      return await this.translateSentence(original, translation, 'markdown');
    });
    return doc;
  }
}

function prettify(md: string): string {
  return md
    .replace(/([\w`])(\p{Script=Han})/gu, '$1 $2')
    .replace(/(\p{Script=Han})([\w`])/gu, '$1 $2')
    .replace(/\n\n+/g, '\n\n');
}
