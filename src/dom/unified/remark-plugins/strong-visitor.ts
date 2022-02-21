import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function strongVisitor(this: UnifiedParser, node: Node): string {
  const marker = (node.marker ?? this.options.strong ?? '*').repeat(2);
  return marker + this.all(node).join('') + marker;
}
