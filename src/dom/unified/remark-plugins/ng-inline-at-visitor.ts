import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function ngInlineAtVisitor(this: UnifiedParser, node: Node): string {
  return `{@${node.name}${node.value}}`;
}
