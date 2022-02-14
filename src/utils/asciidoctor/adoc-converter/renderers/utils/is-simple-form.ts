import { AdocNode } from '../adoc-node';

export function isSimpleForm(node: AdocNode) {
  return node.content_model === 'simple' && !node.getTitle();
}
