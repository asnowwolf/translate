import { Node } from 'unist';

export function strongVisitor(this: any, node: Node) {
  const marker = (node.marker ?? this.options.strong ?? '*').repeat(2);
  return marker + this.all(node).join('') + marker;
}
