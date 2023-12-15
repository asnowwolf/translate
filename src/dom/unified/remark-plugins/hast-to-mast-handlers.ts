import * as all from 'hast-util-to-mdast/lib/all';
import { Rehype } from '../rehype';
import { Node } from 'hast-util-to-html/lib';

function generateHtmlRaw(h, node: Node) {
  const value = Rehype.stringify(node);
  return h(node, 'htmlRaw', { value }, []);
}

function generateHtmlTag(h, node: Node) {
  return h(node, 'htmlTag', {
    tagName: node.tagName,
    selfClosing: false,
    attributes: { ...node.properties as {}, ...({}) },
  }, all(h, node));
}

export const hastToMastHandlers = {
  em: (h, node: Node) => h(node, 'emphasis', { marker: node.properties['nt__marker'] }, all(h, node)),
  strong: (h, node: Node) => h(node, 'strong', { marker: node.properties['nt__marker'] }, all(h, node)),
  li: (h, node: Node) => h(node, 'listItem', { marker: node.properties['nt__marker'] }, all(h, node)),
  'code-tabs': (h, node: Node) => generateHtmlRaw(h, node),
  'code-example': (h, node: Node) => generateHtmlRaw(h, node),
  'code-examples': (h, node: Node) => generateHtmlRaw(h, node),
  br: (h, node: Node) => generateHtmlRaw(h, node),
  img: (h, node: Node) => generateHtmlRaw(h, node),
  'live-example': (h, node: Node) => generateHtmlTag(h, node),
  'header': (h, node: Node) => generateHtmlTag(h, node),
  'div': (h, node: Node) => generateHtmlTag(h, node),
  'tag': (h, node: Node) => h(node, 'html', { value: decodeURIComponent((node.properties as { value: string }).value) }, all(h, node)),
  'html-raw': (h, node: Node) => h(node, 'htmlRaw', { value: decodeURIComponent((node.properties as { value: string }).value) }, all(h, node)),
  'ng-inline-at': (h, node: Node) => h(node, 'ngInlineAt', { name: node.properties['name'], value: node.properties['value'] }, all(h, node)),
  'ng-doc-directive': (h, node: Node) => h(node, 'ngDocDirective', { name: node.properties['name'], value: node.properties['value'] }, all(h, node)),
  'comment': (h, node: Node) => h(node, 'comment', { value: node.value }),
  a: (h, node: Node) => {
    const href = node.properties['href'];
    const title = node.properties['title'];
    if (href?.startsWith('linkRef:')) {
      const url = href.replace(/^linkRef:/, '');
      return h(node, 'linkReference', { identifier: url, label: url }, all(h, node));
    } else if (href) {
      return h(node, 'link', { url: href, title }, all(h, node));
    } else if (node.properties['name']) {
      return h(node, 'anchor', { ...node.properties as {} }, all(h, node));
    }
  },
};
