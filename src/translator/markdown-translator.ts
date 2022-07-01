import { AbstractTranslator } from './abstract-translator';
import { Node, Parent } from 'unist';
import { cloneDeep } from 'lodash';
import { safeDump, safeLoad } from 'js-yaml';
import { LinkReference, ListItem, YAML } from 'mdast';
import * as unistMap from 'unist-util-flatmap';
import * as unistVisit from 'unist-util-visit';
import * as unistRemove from 'unist-util-remove';
import { containsChinese } from '../dom/common';
import { sameExceptWhitespace } from './same-except-whitespace';
import { Md } from '../dom/unified/md';

export class MarkdownTranslator extends AbstractTranslator<Node> {
  parse(text: string): Node {
    return Md.parse(text);
  }

  serialize(doc: Node): string {
    this.clearNoTranslatable(doc);
    return prettify(Md.stringify(doc));
  }

  translateDoc(doc: Node): Node {
    unistVisit(doc, (node) => {
      if (node.tableCell) {
        node.type = 'paragraph';
      }
    });
    const result = mapToNodePairs(doc);
    const { nodes, frontMatters } = this.extractNodesAndFrontMatters(result);

    frontMatters.map(yaml => {
      const frontMatter = (safeLoad(yaml.value) as object) || {};
      const result = {};
      const entries = Object.entries(frontMatter);
      const tasks = entries.map(item => {
        const [key, value] = item;
        result[`${key}$$origin`] = value;
        return this.translateSentence(value, 'markdown').then((translation) => {
          result[key] = translation.trim();
        });
      });
      return Promise.all(tasks).then(() => {
        yaml.value = safeDump(result);
      });
    });

    nodes.map(original => {
      return this.translateSentence(Md.stringify(preprocess(original)), 'markdown')
        .then(translation => postprocess(Md.parse(translation) as Parent, original as Parent))
        .then(translation => {
          if (!translation) {
            return;
          }
          if (!original.tableCell && shouldRemoveTranslation(original, translation)) {
            unistRemove(result, original);
          }
          if (original.tableCell) {
            translation.type = 'tableCell';
          }
          Object.assign(original, translation);
        });
    });
    return doc;
  }

  private clearNoTranslatable(node: Node) {
    unistVisit(node, (node: Node, index: number, parent: Parent) => {
      if (Md.isLink(node) && node.url?.startsWith('linkRef:')) {
        const ref = node as unknown as LinkReference;
        ref.type = 'linkReference';
        ref.label = node.url.replace(/^linkRef:/, '');
        ref.identifier = ref.label.toLowerCase();
      }
      if (Md.isTableRow(node)) {
        const prev = parent.children[index - 1];
        if (isSameRow(prev, node)) {
          unistRemove(parent, node);
        }
      }
    });
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
  const result = cloneDeep(node);
  result.type = 'paragraph';
  return result;
}

function postprocess(root: Parent, original: Parent): Node {
  const node = cloneDeep(original);
  if (original.type) {
    const translation = root.children[0] as Parent;
    if (!translation) {
      return original;
    }
    if (translation.type === 'htmlRaw') {
      node.children = [translation];
    } else {
      node.children = translation?.children ?? [];
    }
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

function shouldRemoveTranslation(original: Node, translation: Node): boolean {
  return sameExceptWhitespace(Md.stringify(original), Md.stringify(translation));
}

function isSameRow(prev: Node, current: Node): boolean {
  if (!prev || !current) {
    return false;
  }
  if (!Md.isTableRow(prev) || !Md.isTableRow(current)) {
    return false;
  }
  if (prev.children.length !== current.children.length) {
    return false;
  }
  for (let i = 0; i < prev.children.length; ++i) {
    if (!sameExceptWhitespace(Md.stringify(prev.children[i]), Md.stringify(current.children[i]))) {
      return false;
    }
  }
  return true;
}

function prettify(md: string): string {
  return md
    .replace(/([\w`])([\u4e00-\u9fa5])/g, '$1 $2')
    .replace(/([\u4e00-\u9fa5])([\w`])/g, '$1 $2')
    .replace(/\n\n+/g, '\n\n');
}
