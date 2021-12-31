import * as all from 'hast-util-to-mdast/lib/all';

export const hastToMastHandlers = {
  em: (h, node) => h(node, 'emphasis', { marker: node.properties['nt__marker'] }, all(h, node)),
  strong: (h, node) => h(node, 'strong', { marker: node.properties['nt__marker'] }, all(h, node)),
  li: (h, node) => h(node, 'listItem', { marker: node.properties['nt__marker'] }, all(h, node)),
};
