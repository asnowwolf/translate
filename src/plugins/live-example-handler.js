var all = require('hast-util-to-mdast/lib/all');

function handler(h, node) {
  return h(node, 'live-example', all(h, node));
}

module.exports = handler;
