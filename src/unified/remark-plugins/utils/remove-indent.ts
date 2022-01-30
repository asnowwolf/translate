import { getIndent } from './get-indent';

const tab = '\t';
const lineFeed = '\n';
const space = ' ';
const exclamationMark = '!';

// Remove the minimum indent from every line in `value`.  Supports both tab,
// spaced, and mixed indentation (as well as possible).
export function removeIndent(value, maximum) {
  const values = value.split(lineFeed);
  let position = values.length + 1;
  let minIndent = Infinity;
  const matrix = [];
  let index;
  let indentation;
  let stops;
  let padding;

  values.unshift(space.repeat(maximum) + exclamationMark);

  while (position--) {
    indentation = getIndent(values[position]);

    matrix[position] = indentation.stops;

    if (!values[position].trim().length) {
      continue;
    }

    if (indentation.indent) {
      if (indentation.indent > 0 && indentation.indent < minIndent) {
        minIndent = indentation.indent;
      }
    } else {
      minIndent = Infinity;

      break;
    }
  }

  if (minIndent !== Infinity) {
    position = values.length;

    while (position--) {
      stops = matrix[position];
      index = minIndent;

      while (index && !(index in stops)) {
        index--;
      }

      if (
        values[position].trim().length &&
        minIndent &&
        index !== minIndent
      ) {
        padding = tab;
      } else {
        padding = '';
      }

      values[position] =
        padding + values[position].slice(index in stops ? stops[index] + 1 : 0);
    }
  }

  values.shift();

  return values.join(lineFeed);
}
