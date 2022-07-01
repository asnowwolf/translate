import { pad } from './utils/pad';
import { Node, Position } from 'unist';
import { UnifiedParser } from './unified-parser';

const tabSize = 4;

// Stringify a list item.
//
// Prefixes the content with a checked checkbox when `checked: true`:
//
// ```markdown
// [x] foo
// ```
//
// Prefixes the content with an unchecked checkbox when `checked: false`:
//
// ```markdown
// [ ] foo
// ```
export function listItemVisitor(this: UnifiedParser, node: Node, parent?: Node, position?: Position, bullet?: string): string {
  const style = this.options.listItemIndent;
  const marker = node.marker || bullet || this.options.bullet;
  const spread = node.spread == null ? true : node.spread;
  const checked = node.checked;
  const children = node.children as Node[];

  const values = children.map(it => this.visit(it, node).trim());

  if (spread) {
    values.push('');
  }

  let value = values.join(spread ? '\n\n' : '\n');

  if (typeof checked === 'boolean') {
    // Note: I’d like to be able to only add the space between the check and
    // the value, but unfortunately github does not support empty list-items
    // with a checkbox :(
    value = `[${checked ? 'x' : ' '}] ${value}`;
  }

  let indent;
  let spacing;
  if (style === '1' || (style === 'mixed' && value.indexOf('\n') === -1)) {
    indent = marker.length + 1;
    spacing = ' ';
  } else {
    indent = Math.ceil((marker.length + 1) / tabSize) * tabSize;
    spacing = ' '.repeat(indent - marker.length);
  }

  if (value) {
    return marker + spacing + pad(value, indent / tabSize).slice(indent);
  } else {
    return marker;
  }
}
