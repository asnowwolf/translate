import { Node } from 'unist';
import { UnifiedParser } from './unified-parser';

export function emphasisVisitor(this: UnifiedParser, node: Node): string {
  let marker = node.marker ?? this.options.emphasis;
  const content = this.all(node).join('');

  // When in pedantic mode, prevent using underscore as the marker when there
  // are underscores in the content.
  if (
    this.options.pedantic &&
    marker === '_' &&
    content.indexOf(marker) !== -1
  ) {
    marker = '*';
  }

  return marker + content + marker;
}
