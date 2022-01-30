import { Node } from 'unist';

export function plainHtmlVisitor(this: any, node: Node) {
  return node.value;
}
