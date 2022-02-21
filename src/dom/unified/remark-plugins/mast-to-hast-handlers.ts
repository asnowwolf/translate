import * as all from 'mdast-util-to-hast/lib/all';

export const mastToHastHandlers = {
  emphasis: (h, node) => h(node, 'em', { 'nt__marker': node.marker }, all(h, node)),
  strong: (h, node) => h(node, 'strong', { 'nt__marker': node.marker }, all(h, node)),
  listItem: (h, node) => h(node, 'li', { 'nt__marker': node.marker }, all(h, node)),
  linkReference: (h, node) => h(node, 'a', { href: 'linkRef:' + node.identifier }, all(h, node)),
  anchor: (h, node) => h(node, 'a', { name: node.name }, all(h, node)),
  plainHtml: (h, node) => h(node, 'plain-html', { value: escape(node.value) }, all(h, node)),
  originalId: (h, node) => h(node, 'original-id', { translate: 'no', value: escape(node.value) }, all(h, node)),
};
