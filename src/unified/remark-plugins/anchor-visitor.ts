import { Node } from 'unist';

export function anchorVisitor(this: any, node: Node) {
  return `{@a ${node.name}}`;
}
