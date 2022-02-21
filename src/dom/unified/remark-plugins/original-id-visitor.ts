import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function originalIdVisitor(this: UnifiedParser, node: Node): string {
  return ` {@originalId ${node.value}}`;
}
