const tab = '\t';
const space = ' ';

const spaceSize = 1;
const tabSize = 4;

// Gets indentation information for a line.
export function getIndent(value) {
  let index = 0;
  let indent = 0;
  let character = value.charAt(index);
  const stops = {};
  let size;

  while (character === tab || character === space) {
    size = character === tab ? tabSize : spaceSize;

    indent += size;

    if (size > 1) {
      indent = Math.floor(indent / size) * size;
    }

    stops[indent] = index;
    character = value.charAt(++index);
  }

  return { indent: indent, stops: stops };
}
