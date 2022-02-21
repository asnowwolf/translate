import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function anchorVisitor(this: UnifiedParser, node: Node): string {
  return `{@a ${node.name}}`;
}
