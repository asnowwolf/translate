import { Node } from 'unist';
import * as unified from 'unified';

import * as rehypeStringify from 'rehype-stringify';
import * as rehypeParse from 'rehype-parse';

export class Rehype {
  static stringify(node: Node): string {
    return unified().use(rehypeStringify, { closeSelfClosing: true }).stringify(node);
  }

  static parse(html: string): Node {
    return unified().use(rehypeParse).parse(html);
  }

  static parseFragment(html: string): Node {
    const htmlElement = this.parse(html).children[0];
    const bodyElement = htmlElement.children[1];
    return bodyElement.children[0];
  }
}
