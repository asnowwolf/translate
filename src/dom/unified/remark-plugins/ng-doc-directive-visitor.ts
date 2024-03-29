import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function ngDocDirectiveVisitor(this: UnifiedParser, node: Node): string {
  return [`@${node.name}`, node.value].filter(it => !!it).join(' ');
}
