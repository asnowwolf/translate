export function needDelimiter(node: any): boolean {
  return !!node.getTitle() || node.lines?.some(line => line.trim() === '') || node.getBlocks().length > 0;
}
