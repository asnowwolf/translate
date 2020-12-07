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
import { cloneDeep } from 'lodash';
import { TranslationEngine } from './engine';
import { containsChinese } from './common';
import { ListItem } from 'mdast';
import * as stringWidth from 'string-width';
import { safeDump, safeLoad } from 'js-yaml';
import * as codeExampleHandler from './plugins/code-example-handler';
import * as liveExampleHandler from './plugins/live-example-handler';

const compiler = remarkStringify.Compiler;
compiler.prototype.visitors['code-example'] = function (node) {
  return this.all(node).join('');
};

console.log(compiler);
export namespace markdown {
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

  const customElementHandlers = {
    handlers: {
      'code-example': codeExampleHandler,
      'live-example': liveExampleHandler,
    },
  };

  export function htmlToMd(html: string): Node {
    return parse(unified().use(rehypeParse).use(rehypeRemark, customElementHandlers).use(remarkStringify, stringifyOptions).processSync(html));
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

  async function translateNormalNode(node: Node, engine: TranslationEngine): Promise<Node> {
    const html = mdToHtml(preprocess(node));
    const translations = await engine.translate([html]);
    return translations.map(it => htmlToMd(it))[0];
  }

  async function translateYaml(yaml: string, engine: TranslationEngine): Promise<string> {
    const frontMatter = (safeLoad(yaml as string) as object) || {};
    const result = {};
    await Promise.all(Object.entries(frontMatter).map(async ([key, value]) => {
      const translation = await engine.translate([value]);
      result[`${key}$$origin`] = value;
      result[key] = translation[0];
    }));
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

  export async function translate(tree: Node, engine: TranslationEngine): Promise<Node> {
    const result = mapToPaired(tree);
    const pairs: Node[] = [];
    await unistVisit(result, async (node) => {
      if (node.type === 'yaml') {
        node.value = await translateYaml(node.value, engine);
      } else if (node.translation) {
        pairs.push(node);
      }
    });

    const translatedPairs = await Promise.all(pairs.map(it => translateNormalNode(it, engine)));
    pairs.forEach((original, index) => {
      const translation = translatedPairs[index];
      if (translation && stringify(original).trim() === stringify(translation).trim()) {
        unistRemove(result, original);
      }
      postprocess(original, translation);
    });
    return result;
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
