import { Translator } from './translator';
import { Node, Parent } from 'unist';
import { cloneDeep } from 'lodash';
import { safeDump, safeLoad } from 'js-yaml';
import { ListItem, YAML } from 'mdast';
import * as unistMap from 'unist-util-flatmap';
import * as unistVisit from 'unist-util-visit';
import * as unistRemove from 'unist-util-remove';
import { containsChinese } from '../utils/common';
import { markdownParse, markdownStringify } from '../unified/markdown';
import { sameExceptWhitespace } from './same-except-whitespace';

export class MarkdownTranslator extends Translator {
  async translate(text: string): Promise<string> {
    const tree = markdownParse(text);
    unistVisit(tree, (node) => {
      if (node.tableCell) {
        node.type = 'paragraph';
      }
      if (node.type === 'linkReference') {
        node.type = 'link';
        node.url = 'linkRef:' + node.identifier;
      }
    });
    const result = mapToNodePairs(tree);
    const { nodes, frontMatters } = this.extractNodesAndFrontMatters(result);

    frontMatters.forEach(yaml => {
      const frontMatter = (safeLoad(yaml.value) as object) || {};
      const result = {};
      const entries = Object.entries(frontMatter);
      const tasks = entries.map(item => {
        const [key, value] = item;
        result[`${key}$$origin`] = value;
        return this.engine.translateMd(value).then((translation) => {
          result[key] = translation.trim();
        });
      });
      Promise.all(tasks).then(() => {
        yaml.value = safeDump(result);
      });
    });

    nodes.forEach(original => {
      this.engine.translateMd(markdownStringify(preprocess(original)))
        .then(translation => markdownParse(translation))
        .then(translation => {
          if (translation && !original.tableCell && sameExceptWhitespace(markdownStringify(original), markdownStringify(translation))) {
            unistRemove(result, original);
          }
          if (original.tableCell) {
            translation.type = 'tableCell';
          }
          Object.assign(original, translation);
        });
    });
    await this.engine.flush();

    unistVisit(result, (node) => {
      if (node.type === 'link' && node.url?.startsWith('linkRef:')) {
        node.type = 'linkReference';
        node.identifier = node.url.replace(/^linkRef:/, '');
      }
    });
    return prettify(markdownStringify(result));
  }

  private extractNodesAndFrontMatters(result): { nodes: Node[]; frontMatters: YAML[] } {
    const nodes: Node[] = [];
    const frontMatters: YAML[] = [];

    unistVisit(result, (node) => {
      if (node.type === 'yaml') {
        frontMatters.push(node);
      } else if (node.translation) {
        nodes.push(node);
      }
    });
    return { nodes, frontMatters };
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
