import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function htmlRawVisitor(this: UnifiedParser, node: Node): string {
  return `${node.value}`;
}
