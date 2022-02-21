const lineFeed = '\n';
const space = ' ';

const tabSize = 4;

// Pad `value` with `level * tabSize` spaces.  Respects lines.  Ignores empty
// lines.
export function pad(value, level) {
  const values = value.split(lineFeed);
  let index = values.length;
  const padding = space.repeat(level * tabSize);

  while (index--) {
    if (values[index].length !== 0) {
      values[index] = padding + values[index];
    }
  }

  return values.join(lineFeed);
}
