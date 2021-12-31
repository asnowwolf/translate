import * as all from 'mdast-util-to-hast/lib/all';

export const mastToHastHandlers = {
  emphasis: (h, node) => h(node, 'em', { 'nt__marker': node.marker }, all(h, node)),
  strong: (h, node) => h(node, 'strong', { 'nt__marker': node.marker }, all(h, node)),
  listItem: (h, node) => h(node, 'li', { 'nt__marker': node.marker }, all(h, node)),
  linkReference: (h, node) => h(node, 'a', { 'nt__type': 'linkReference', href: node.identifier }, all(h, node)),
};
