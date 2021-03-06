import { Translator } from './translator';
import { Node, Parent } from 'unist';
import { chunk, cloneDeep } from 'lodash';
import { safeDump, safeLoad } from 'js-yaml';
import { ListItem, YAML } from 'mdast';
import * as unistMap from 'unist-util-flatmap';
import * as unistVisit from 'unist-util-visit';
import * as unistRemove from 'unist-util-remove';
import { containsChinese } from '../common';
import { markdownParse, markdownStringify } from '../markdown';

export class MarkdownTranslator extends Translator {
  async translate(text: string): Promise<string> {
    const tree = markdownParse(encodeExampleTags(text));
    const result = mapToNodePairs(tree);
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
      node.value = await this.translateYaml(node.value);
    }

    const translatedPairs = await this.translateNormalNodes(pairs);
    pairs.forEach((original, index) => {
      const translation = translatedPairs[index];
      if (translation && sameExceptWhitespace(markdownStringify(original), markdownStringify(translation))) {
        unistRemove(result, original);
      }
      postprocess(original, translation);
    });
    return prettify(decodeExampleTags(markdownStringify(result)));
  }

  async translateNormalNodes(pairs: Node[]): Promise<Node[]> {
    const originals = pairs.map(it => markdownStringify(preprocess(it)));
    const batches = chunk(originals, this.engine.batchSize);
    const translations = await Promise.all(batches.map(async (it) => this.engine.translate(it)));
    return translations.flat().map(it => markdownParse(it));
  }

  async translateYaml(yaml: string): Promise<string> {
    const frontMatter = (safeLoad(yaml as string) as object) || {};
    const result = {};
    const entries = Object.entries(frontMatter);
    const translations = await this.engine.translate(entries.map(([, value]) => value));
    entries.forEach(([key, value], index) => {
      result[`${key}$$origin`] = value;
      result[key] = translations[index];
    });
    return safeDump(result);
  }
}

function mapToNodePairs(tree: Node) {
  return unistMap(tree, (node, index, parent) => {
    if ((node.type === 'paragraph' || node.type === 'tableRow' || node.type === 'heading') && shouldTranslate(node, index, parent)) {
      return [node, markNode(cloneDeep<Node>(node), parent)];
    }
    return [node];
  });
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

// 对 Angular 官方文档中的 code-example 和 live-example 标记做特殊处理
function encodeExampleTags(text: string): string {
  return text.replace(/(<(code-example|live-example)\b[^>]*>[\s\S]*?<\/\2>)/g, '`$1`');
}

function decodeExampleTags(text: string): string {
  return text.replace(/`(<(code-example|live-example)\b[^>]*>[\s\S]*?<\/\2>)`/g, '$1');
}

function sameExceptWhitespace(s1: string, s2: string): boolean {
  return s1.replace(/\s/g, '') === s2.replace(/\s/g, '');
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

function prettify(md: string): string {
  return md
    .replace(/([\w`])([\u4e00-\u9fa5])/g, '$1 $2')
    .replace(/([\u4e00-\u9fa5])([\w`])/g, '$1 $2')
    .replace(/\n\n+/g, '\n\n');
}
