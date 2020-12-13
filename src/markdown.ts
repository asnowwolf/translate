import * as remarkParse from 'remark-parse';
import * as remarkStringify from 'remark-stringify';
import * as rehypeParse from 'rehype-parse';
import * as remarkHtml from 'remark-html';
import * as rehypeRemark from 'rehype-remark';
import * as frontmatter from 'remark-frontmatter';
import * as unified from 'unified';
import { VFileCompatible } from 'unified';
import * as unistMap from 'unist-util-flatmap';
import * as unistVisit from 'unist-util-visit';
import * as unistRemove from 'unist-util-remove';
import { Node, Parent } from 'unist';
import { chunk, cloneDeep } from 'lodash';
import { TranslationEngine } from './engine';
import { containsChinese } from './common';
import { ListItem, YAML } from 'mdast';
import * as stringWidth from 'string-width';
import { safeDump, safeLoad } from 'js-yaml';

export namespace markdown {
  function encodeExampleTags(text: string): string {
    return text.replace(/(<(code-example|live-example)\b[^>]*>[\s\S]*?<\/\2>)/g, '`$1`');
  }

  function decodeExampleTags(text: string): string {
    return text.replace(/`(<(code-example|live-example)\b[^>]*>[\s\S]*?<\/\2>)`/g, '$1');
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

  export function parse(markdown: VFileCompatible): Node {
    return unified().use(remarkParse)
      .use(frontmatter)
      .parse(markdown);
  }

  export function stringify(tree: Node): string {
    return unified().use(remarkStringify, stringifyOptions)
      .use(frontmatter)
      .stringify(tree);
  }

  export function mdToHtml(ast: Node): string {
    return unified().use(remarkParse)
      .use(frontmatter)
      .use(remarkHtml)
      .processSync(stringify(ast)).contents.toString();
  }

  export function htmlToMd(html: string): Node {
    return parse(unified().use(rehypeParse).use(rehypeRemark).use(remarkStringify, stringifyOptions).processSync(html));
  }

  function alreadyTranslated(nextNode: Node, node: Node) {
    // 如果下一个兄弟节点含中文，而且是同一个类型，说明这个节点已经翻译过了，不用再翻译它
    return nextNode.type === node.type && isChineseNode(nextNode);
  }

  function isChineseNode(node: Node): boolean {
    let result = false;
    unistVisit(node, (it) => {
      if (containsChinese(it.value)) {
        result = true;
      }
    });
    return result;
  }

  function shouldTranslate(node: Node, index: number, parent: Parent): boolean {
    const nextNode = parent.children[index + 1];
    if (nextNode && alreadyTranslated(nextNode, node)) {
      return false;
    }
    return !isChineseNode(node);
  }

  async function translateNormalNodes(pairs: Node[], engine: TranslationEngine): Promise<Node[]> {
    const originals = pairs.map(it => mdToHtml(preprocess(it)));
    const batches = chunk(originals, engine.batchSize);
    const translations = await Promise.all(batches.map(async (it) => engine.translate(it)));
    return translations.flat().map(it => htmlToMd(it));
  }

  async function translateYaml(yaml: string, engine: TranslationEngine): Promise<string> {
    const frontMatter = (safeLoad(yaml as string) as object) || {};
    const result = {};
    const entries = Object.entries(frontMatter);
    const translations = await engine.translate(entries.map(([, value]) => value));
    entries.forEach(([key, value], index) => {
      result[`${key}$$origin`] = value;
      result[key] = translations[index];
    });
    return safeDump(result);
  }

  function mapToPaired(tree: Node) {
    return unistMap(tree, (node, index, parent) => {
      if ((node.type === 'paragraph' || node.type === 'tableRow' || node.type === 'heading') && shouldTranslate(node, index, parent)) {
        return [node, markNode(cloneDeep<Node>(node), parent)];
      }
      return [node];
    });
  }

  export async function translate(original: string, engine: TranslationEngine): Promise<string> {
    const tree = parse(encodeExampleTags(original));
    const result = mapToPaired(tree);
    const pairs: Node[] = [];
    const yamls: YAML[] = [];
    unistVisit(result, (node) => {
      if (node.type === 'yaml') {
        yamls.push(node);
      } else if (node.translation) {
        pairs.push(node);
      }
    });

    for (const node of yamls) {
      node.value = await translateYaml(node.value, engine);
    }

    const translatedPairs = await translateNormalNodes(pairs, engine);
    pairs.forEach((original, index) => {
      const translation = translatedPairs[index];
      if (translation && stringify(original).trim() === stringify(translation).trim()) {
        unistRemove(result, original);
      }
      postprocess(original, translation);
    });
    return decodeExampleTags(stringify(result));
  }

  function preprocess(node: Node): Node {
    if (node.tableCell) {
      node.type = 'paragraph';
    }
    return node;
  }

  function postprocess(node: Node, translation: Node): Node {
    if (node.tableCell) {
      translation.type = 'tableCell';
    }
    Object.assign(node, translation);
    return node;
  }

  function markNode(root: Node, container: Node): Node {
    if (root.type === 'tableRow') {
      unistVisit(root, (node) => {
        if (node.type === 'tableCell') {
          node.translation = true;
          node.tableCell = true;
        }
      });
    } else {
      root.translation = true;
      if (container.type === 'listItem') {
        (container as ListItem).spread = true;
      }
    }
    return root;
  }
}
