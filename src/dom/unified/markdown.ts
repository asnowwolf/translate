import { Node, Parent } from 'unist';
import { Heading, Link, LinkReference, ListItem, Literal, Paragraph, PhrasingContent, Table, TableCell, TableRow, YAML } from 'mdast';
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
import { Visitor } from '../../visitor/visitor';
import { safeDump, safeLoad } from 'js-yaml';
import { cloneDeep } from 'lodash';

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

  export function isLinkReference(node: Node): node is LinkReference {
    return node.type === 'linkReference';
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

  export function isListItem(node: Parent): node is ListItem {
    return node.type === 'listItem';
  }

  export function parse(markdown: VFileCompatible): Parent {
    return unified().use(remarkParse)
      .use(frontmatter)
      .use(customParser)
      .parse(markdown) as Parent;
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
    if (!node) {
      return false;
    }
    if (isLiteral(node)) {
      return containsChinese(node.value);
    } else if (isLink(node)) {
      return containsChinese(node.title) || node.children.some(it => nodeContainsChinese(it));
    } else if (isLinkReference(node)) {
      return containsChinese(node.label) || node.children.some(it => nodeContainsChinese(it));
    } else if (['htmlRaw', 'anchor'].includes(node.type)) {
      return false;
    } else if (isParent(node)) {
      return node.children.some(it => nodeContainsChinese(it));
    } else {
      console.warn('nodeContainsChinese: unknown node type:', node.type);
      return containsChinese(contentOf(node));
    }
  }

  const stringifyOptions = {
    emphasis: '*',
    listItemIndent: 1,
    incrementListMarker: false,
    stringLength: stringWidth,
    paddedTable: true,
    fences: true,
    entities: false,
  };

  export function visit(node: Node, parent: Parent | undefined, visitor: Visitor<Node>): Promise<Node> {
    if (isYaml(node)) {
      return handleFrontMatter(node, visitor);
    } else if (isTable(node)) {
      return handleTable(node, visitor);
    } else if (isTranslatableUnit(node) && !nodeContainsChinese(node)) {
      return handleParagraphAndHeadings(node, parent, visitor);
    } else if (isParent(node)) {
      return Promise.all(node.children.map(it => visit(it, node, visitor))).then(() => node);
    }
  }

  function handleFrontMatter(yaml: YAML, visitor: Visitor<Node>): Promise<YAML> {
    const frontMatter = (safeLoad(yaml.value) as object) || {};
    const entries = Object.entries(frontMatter);

    const tasks = entries.map(([key, value]) => {
      if (key.endsWith('$$origin')) {
        // 忽略保存的原文
        return;
      }

      if (containsChinese(value)) {
        return visitor(frontMatter[`${key}$$origin`], value).then((result: string | undefined) => {
          if (result && containsChinese(result) && result !== value) {
            frontMatter[key] = result;
          }
        });
      } else {
        return visitor(value, undefined).then((result: string | undefined) => {
          if (result && containsChinese(result)) {
            frontMatter[key] = result;
            frontMatter[`${key}$$origin`] = value;
          }
        });
      }
    });
    return Promise.all(tasks.filter(it => !!it)).then(() => {
      yaml.value = safeDump(frontMatter);
      return yaml;
    });
  }

  function handleTable(table: Table, visitor: Visitor<Node>): Promise<Table> {
    const tasks = [];

    // 倒序循环，以免插入的新节点影响循环本身
    for (let rowIndex = table.children.length - 1; rowIndex >= 0; --rowIndex) {
      const originalRow = table.children[rowIndex];
      const translationRow = table.children[rowIndex + 1];
      // 原文和译文按行进行对照，只需要处理原文行，译文行是被动处理的
      if (!nodeContainsChinese(originalRow)) {
        // 有译文行时要提取译文行，没有译文行时要插入译文行
        if (nodeContainsChinese(translationRow)) {
          console.assert(originalRow.children.length === translationRow.children.length);
          for (let colIndex = 0; colIndex < originalRow.children.length; colIndex++) {
            const originalCell = originalRow.children[colIndex];
            const translationCell = translationRow.children[colIndex];
            const originalText = stringify(originalCell);
            const translationText = stringify(translationCell);
            tasks.push(visitor(originalText, translationText).then((result: string | undefined) => {
              if (result && containsChinese(result) && result !== translationText) {
                translationCell.children = parseCellContent(result);
              }
            }));
          }
        } else {
          let translationRow: TableRow;
          for (let colIndex = 0; colIndex < originalRow.children.length; colIndex++) {
            const originalCell = originalRow.children[colIndex];
            const originalText = stringify(originalCell);
            tasks.push(visitor(originalText, undefined).then((result: string | undefined) => {
              if (result && containsChinese(result)) {
                if (!translationRow) {
                  translationRow = cloneDeep(originalRow);
                  table.children.splice(rowIndex + 1, 0, translationRow);
                }
                const translationCell = translationRow.children[colIndex];
                translationCell.children = parseCellContent(result);
              }
            }));
          }
        }
      }
    }
    return Promise.all(tasks).then(() => table);

    function parseCellContent(result: string): PhrasingContent[] {
      const paragraph = parse(result).children[0] as Paragraph;
      return paragraph.children;
    }
  }

  function handleParagraphAndHeadings(originalNode: Parent, parent: Parent, visitor: Visitor<Node>): Promise<Node> {
    // 我们要处理的所有节点都必须是 Parent，因为它至少也会包含一个 text 子节点
    const index = parent.children.indexOf(originalNode);
    const translationNode = parent.children[index + 1];
    const originalText = contentOf(originalNode);
    if (translationNode && originalNode.type === translationNode.type && nodeContainsChinese(translationNode)) {
      const translationText = contentOf(translationNode);
      return visitor(originalText, translationText).then((result) => {
        if (!result || !containsChinese(result) || result === translationText) {
          return translationNode;
        }
        applyTranslation(translationNode, result);
        return translationNode;
      });
    } else {
      return visitor(originalText, undefined).then((result) => {
        if (!result || !containsChinese(result)) {
          return originalNode;
        }
        const translationNode = createAndInsertTranslation(parent, originalNode);
        applyTranslation(translationNode, result);
        return translationNode;
      });
    }

    function applyTranslation(translationNode: Node, result: string): void {
      if (isListItem(parent)) {
        // 如果是 listItem 被翻译了，则需要扩展成阔表模式，以便容纳两个段落
        parent.spread = true;
      }
      const translation = parse(result).children[0] as Paragraph;
      Object.assign(translationNode, translation, { type: originalNode.type });
    }

    function createAndInsertTranslation(parent: Parent, original: Parent): Parent {
      const node = cloneDeep(original);
      const index = parent.children.indexOf(original);
      parent.children.splice(index + 1, 0, node);
      return node;
    }
  }

  function contentOf(node?: Node): string | undefined {
    if (!node) {
      return;
    }
    const cloned = cloneDeep(node);
    if (cloned.type !== 'paragraph' && cloned.type !== 'heading') {
      cloned.type = 'paragraph';
    }
    return stringify(cloned);
  }
}
