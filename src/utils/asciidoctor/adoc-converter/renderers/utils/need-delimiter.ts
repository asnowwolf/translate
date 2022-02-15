import { AdocNode } from '../adoc-node';

export function needDelimiter(node: AdocNode): boolean {
  return !!node.getTitle() || node.lines?.some(line => line.trim() === '') || node.getBlocks().length > 0;
}
