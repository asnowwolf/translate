import { UnifiedParser } from './unified-parser';
import { Node } from 'unist';

export function htmlCommentVisitor(this: UnifiedParser, node: Node): string {
  return `<!--${node.value}-->`;
}
