import { AdocNode } from '../adoc-node';

export function hasEmptyLine(node: AdocNode) {
  return node.convert().includes('\n\n');
}
