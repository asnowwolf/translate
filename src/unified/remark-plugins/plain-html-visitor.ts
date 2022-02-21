import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function plainHtmlVisitor(this: UnifiedParser, node: Node): string {
  return node.value as string;
}
