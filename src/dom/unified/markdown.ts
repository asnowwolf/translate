import { Node, Parent } from 'unist';
import { Heading, Link, Literal, Paragraph, Table, TableCell, TableRow, YAML } from 'mdast';
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

export namespace markdown {
  export function isLiteral(node: Node): node is Literal {
    return [
      'html',
      'code',
      'yaml',
      'text',
      'inlineCode',
    ].includes(node.type);
  }

  export function isParent(node: Node): node is Parent {
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

  export function isTranslatableUnit(node: Node): node is Paragraph | Heading {
    return node.type === 'paragraph' || node.type === 'heading';
  }

  export function isLink(node: Node): node is Link {
    return node.type === 'link';
  }

  export function isTableRow(node: Node): node is TableRow {
    return node.type === 'tableRow';
  }

  export function isTableCell(node: Node): node is TableCell {
    return node.type === 'tableCell';
  }

  export function isTable(node: Node): node is Table {
    return node.type === 'table';
  }

  export function isTableFamily(node: Node): node is Table | TableRow | TableCell {
    return isTable(node) || isTableRow(node) || isTableCell(node);
  }

  export function isYaml(node: Node): node is YAML {
    return node.type === 'yaml';
  }

  export function parse(markdown: VFileCompatible): Node {
    return unified().use(remarkParse)
      .use(frontmatter)
      .use(customParser)
      .parse(markdown);
  }

  export function stringify(tree: Node): string {
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

  export function toHtml(textOrAst: Node | string): string {
    let text: string;
    if (typeof textOrAst === 'string') {
      text = textOrAst;
    } else {
      text = stringify(textOrAst).replace(/^<p>([\s\S]*?)<\/p>$/gi, '$1');
    }
    return unified().use(remarkParse)
      .use(frontmatter)
      .use(customParser)
      .use(remarkRehype, { handlers: mastToHastHandlers })
      .use(rehypeStringify, { closeSelfClosing: true })
      .processSync(text).contents.toString();
  }

  export function fromHtml(html: string): Node {
    return parse(mdFromHtml(html));
  }

  export function mdToHtml(md: string): string {
    return toHtml(md);
  }

  export function mdFromHtml(html: string): string {
    if (!html) {
      return html;
    }
    return unified().use(rehypeParse)
      .use(rehypeRemark, { handlers: hastToMastHandlers })
      .use(remarkStringify, stringifyOptions)
      .use(customCompiler)
      .processSync(html).contents.toString().trim();
  }

  export function normalize(text: string): string {
    return stringify(parse(text));
  }

  export function nodeContainsChinese(node: Node): boolean {
    if (isLiteral(node)) {
      return containsChinese(node.value);
    } else if (isParent(node)) {
      return node.children.some(it => nodeContainsChinese(it));
    }
    throw new Error(`Unexpected node type: ${node.type}`);
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
}
