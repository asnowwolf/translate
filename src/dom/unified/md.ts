import { Node, Parent } from 'unist';
import { Heading, Link, Literal, Paragraph, Table, TableCell, TableRow } from 'mdast';
import * as unified from 'unified';
import { VFileCompatible } from 'unified';
import { customParser } from './remark-plugins/custom-parser-plugin';
import { customCompiler } from './remark-plugins/custom-compiler-plugin';
import { mastToHastHandlers } from './remark-plugins/mast-to-hast-handlers';
import { hastToMastHandlers } from './remark-plugins/hast-to-mast-handlers';
import * as remarkParse from 'remark-parse';
import * as remarkStringify from 'remark-stringify';
import * as rehypeParse from 'rehype-parse';
import * as rehypeStringify from 'rehype-stringify';
import * as remarkRehype from 'remark-rehype';
import * as rehypeRemark from 'rehype-remark';
import * as frontmatter from 'remark-frontmatter';
import * as stringWidth from 'string-width';
import { containsChinese } from '../common';

export class Md {
  static isLiteral(node: Node): node is Literal {
    return [
      'html',
      'code',
      'yaml',
      'text',
      'inlineCode',
    ].includes(node.type);
  }

  static isParent(node: Node): node is Parent {
    return [
      'root',
      'paragraph',
      'heading',
      'blockquote',
      'list',
      'listItem',
      'table',
      'tableRow',
      'tableCell',
      'emphasis',
      'strong',
      'delete',
      'footnote',
    ].includes(node.type);
  }

  static isTranslatableUnit(node: Node): node is Paragraph | Heading {
    return node.type === 'paragraph' || node.type === 'heading';
  }

  static isLink(node: Node): node is Link {
    return node.type === 'link';
  }

  static isTableRow(node: Node): node is TableRow {
    return node.type === 'tableRow';
  }

  static isTableCell(node: Node): node is TableCell {
    return node.type === 'tableCell';
  }

  static isTable(node: Node): node is Table {
    return node.type === 'table';
  }

  static isTableFamily(node: Node): node is Table | TableRow | TableCell {
    return this.isTable(node) || this.isTableRow(node) || this.isTableCell(node);
  }

  static parse(markdown: VFileCompatible): Node {
    return unified().use(remarkParse)
      .use(frontmatter)
      .use(customParser)
      .parse(markdown);
  }

  static stringify(tree: Node): string {
    tree.children = tree.children ?? [];
    return unified().use(remarkStringify, stringifyOptions)
      .use(frontmatter)
      .use(customCompiler)
      .stringify(tree)
      .replace(/ /g, '&nbsp;')
      .replace(/[ \t]+$/g, '')
      // 无法完美处理 list-item-visitor 出现两个空行或者少一个空行的问题，因此只好在这里做后期替换
      .replace(/\n\n\n+/g, '\n\n')
      .trim();
  }

  static toHtml(textOrAst: Node | string): string {
    let text: string;
    if (typeof textOrAst === 'string') {
      text = textOrAst;
    } else {
      text = this.stringify(textOrAst).replace(/^<p>([\s\S]*?)<\/p>$/gi, '$1');
    }
    return unified().use(remarkParse)
      .use(frontmatter)
      .use(customParser)
      .use(remarkRehype, { handlers: mastToHastHandlers })
      .use(rehypeStringify, { closeSelfClosing: true })
      .processSync(text).contents.toString();
  }

  static fromHtml(html: string): Node {
    return this.parse(this.mdFromHtml(html));
  }

  static mdToHtml(md: string): string {
    return this.toHtml(md);
  }

  static mdFromHtml(html: string): string {
    if (!html) {
      return html;
    }
    return unified().use(rehypeParse)
      .use(rehypeRemark, { handlers: hastToMastHandlers })
      .use(remarkStringify, stringifyOptions)
      .use(customCompiler)
      .processSync(html).contents.toString().trim();
  }

  static normalize(text: string): string {
    return this.stringify(this.parse(text));
  }

  static containsChinese(node: Node): boolean {
    if (Md.isLiteral(node)) {
      return containsChinese(node.value);
    } else if (Md.isParent(node)) {
      return node.children.some(it => this.containsChinese(it));
    }
    throw new Error(`Unexpected node type: ${node.type}`);
  }
}

const stringifyOptions = {
  emphasis: '*',
  listItemIndent: 1,
  incrementListMarker: false,
  stringLength: stringWidth,
  paddedTable: false,
  fences: true,
  entities: false,
};
