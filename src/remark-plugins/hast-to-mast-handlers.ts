import * as all from 'hast-util-to-mdast/lib/all';

export const hastToMastHandlers = {
  em: (h, node) => h(node, 'emphasis', { marker: node.properties['nt__marker'] }, all(h, node)),
  strong: (h, node) => h(node, 'strong', { marker: node.properties['nt__marker'] }, all(h, node)),
  li: (h, node) => h(node, 'listItem', { marker: node.properties['nt__marker'] }, all(h, node)),
  'plain-html': (h, node) => h(node, 'plainHtml', {value: unescape(node.properties['value'])}, all(h, node)),
  a: (h, node) => {
    const href = node.properties['href'];
    if (href?.startsWith('linkRef:')) {
      const url = href.replace(/^linkRef:/, '');
      return h(node, 'linkReference', { identifier: url, label: url }, all(h, node));
    } else if (href) {
      return h(node, 'link', { url: href }, all(h, node));
    } else if (node.properties['name']) {
      return h(node, 'anchor', { name: node.properties['name'] }, all(h, node));
    }
  },
};
