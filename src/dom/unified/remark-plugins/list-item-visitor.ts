import { pad } from './utils/pad';
import { Node, Position } from 'unist';
import { UnifiedParser } from './unified-parser';

const lineFeed = '\n';
const space = ' ';
const leftSquareBracket = '[';
const rightSquareBracket = ']';
const lowercaseX = 'x';

const ceil = Math.ceil;
const blank = lineFeed + lineFeed;

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
  const self = this;
  const style = self.options.listItemIndent;
  const marker = node.marker || bullet || self.options.bullet;
  const spread = node.spread == null ? true : node.spread;
  const checked = node.checked;
  const children = node.children as Node[];
  const length = children.length;
  const values = [];
  let index = -1;
  let value;
  let indent;
  let spacing;

  while (++index < length) {
    values[index] = self.visit(children[index], node);
  }

  value = values.join(spread ? blank : lineFeed);

  if (typeof checked === 'boolean') {
    // Note: I’d like to be able to only add the space between the check and
    // the value, but unfortunately github does not support empty list-items
    // with a checkbox :(
    value =
      leftSquareBracket +
      (checked ? lowercaseX : space) +
      rightSquareBracket +
      space +
      value;
  }

  if (style === '1' || (style === 'mixed' && value.indexOf(lineFeed) === -1)) {
    indent = marker.length + 1;
    spacing = space;
  } else {
    indent = ceil((marker.length + 1) / tabSize) * tabSize;
    spacing = space.repeat(indent - marker.length);
  }

  return value
    ? marker + spacing + pad(value, indent / tabSize).slice(indent)
    : marker;
}
