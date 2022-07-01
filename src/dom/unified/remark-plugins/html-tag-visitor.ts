import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function htmlTagVisitor(this: UnifiedParser, node: Node): string {
  const attributes = Object.entries(node?.attributes ?? {})
    .map(([key, value]) => `${key}="${value}"`);
  const attrText = ['', ...attributes].join(' ');
  if (node.selfClosing || node.type === 'br') {
    return `<${node.tagName}${attrText} />`;
  } else {
    const content = node.content ?? this.all(node).join('\n\n');
    return [`<${node.tagName}${attrText}>`, content, `</${node.tagName}>`].join(node.block ? '\n' : '');
  }
}
