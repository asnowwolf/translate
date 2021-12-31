import { removeIndent } from './utils/remove-indent';
import { getIndent } from './utils/get-indent';

const tabSize = 4;
const looseListItemExpression = /\n\n(?!\s*$)/;
const taskItemExpression = /^\[([ \t]|x|X)][ \t]/;
const bulletExpression = /^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/;
const pedanticBulletExpression = /^([ \t]*)([*+-]|\d+[.)])([ \t]+)/;
const initialIndentExpression = /^( {1,4}|\t)?/gm;

function isDecimal(character): boolean {
  const code = typeof character === 'string' ? character.charCodeAt(0) : character;
  return code >= 48 && code <= 57; /* 0-9 */
}

export function listTokenizer(this, eat, value, silent) {
  const self = this;
  const commonmark = self.options.commonmark;
  const pedantic = self.options.pedantic;
  const tokenizers = self.blockTokenizers;
  const interuptors = self.interruptList;
  let index = 0;
  let length = value.length;
  let start = null;
  let size = 0;
  let queue;
  let ordered;
  let character;
  let marker;
  let currentMarker;
  let empty;
  let item;
  let spread = false;

  while (index < length) {
    character = value.charAt(index);

    if (character === '\t') {
      size += tabSize - (size % tabSize);
    } else if (character === ' ') {
      size++;
    } else {
      break;
    }

    index++;
  }

  if (size >= tabSize) {
    return;
  }

  character = value.charAt(index);

  if (character === '*' || character === '+' || character === '-') {
    marker = character;
    ordered = false;
  } else {
    ordered = true;
    queue = '';

    while (index < length) {
      character = value.charAt(index);

      if (!isDecimal(character)) {
        break;
      }

      queue += character;
      index++;
    }

    character = value.charAt(index);

    if (
      !queue ||
      !(character === '.' || (commonmark && character === ')'))
    ) {
      return;
    }

    start = parseInt(queue, 10);
    marker = character;
  }

  character = value.charAt(++index);

  if (
    character !== ' ' &&
    character !== '\t' &&
    (pedantic || (character !== '\n' && character !== ''))
  ) {
    return;
  }

  if (silent) {
    return true;
  }

  index = 0;
  const items = [];
  let allLines = [];
  let emptyLines = [];
  while (index < length) {
    let nextIndex = value.indexOf('\n', index);
    const startIndex = index;
    let prefixed = false;
    let indented = false;
    if (nextIndex === -1) {
      nextIndex = length;
    }

    let end = index + tabSize;
    size = 0;

    while (index < length) {
      character = value.charAt(index);

      if (character === '\t') {
        size += tabSize - (size % tabSize);
      } else if (character === ' ') {
        size++;
      } else {
        break;
      }

      index++;
    }

    if (size >= tabSize) {
      indented = true;
    }

    if (item && size >= item.indent) {
      indented = true;
    }

    character = value.charAt(index);
    currentMarker = null;

    if (!indented) {
      if (
        character === '*' ||
        character === '+' ||
        character === '-'
      ) {
        currentMarker = character;
        index++;
        size++;
      } else {
        queue = '';

        while (index < length) {
          character = value.charAt(index);

          if (!isDecimal(character)) {
            break;
          }

          queue += character;
          index++;
        }

        character = value.charAt(index);
        index++;

        if (
          queue &&
          (character === '.' || (commonmark && character === ')'))
        ) {
          currentMarker = character;
          size += queue.length + 1;
        }
      }

      if (currentMarker) {
        character = value.charAt(index);

        if (character === '\t') {
          size += tabSize - (size % tabSize);
          index++;
        } else if (character === ' ') {
          end = index + tabSize;

          while (index < end) {
            if (value.charAt(index) !== ' ') {
              break;
            }

            index++;
            size++;
          }

          if (index === end && value.charAt(index) === ' ') {
            index -= tabSize - 1;
            size -= tabSize - 1;
          }
        } else if (character !== '\n' && character !== '') {
          currentMarker = null;
        }
      }
    }

    if (currentMarker) {
      if (!pedantic && marker !== currentMarker) {
        break;
      }

      prefixed = true;
    } else {
      if (!commonmark && !indented && value.charAt(startIndex) === ' ') {
        indented = true;
      } else if (commonmark && item) {
        indented = size >= item.indent || size > tabSize;
      }

      prefixed = false;
      index = startIndex;
    }

    const line = value.slice(startIndex, nextIndex);
    const content = startIndex === index ? line : value.slice(index, nextIndex);
    if (
      currentMarker === '*' ||
      currentMarker === '_' ||
      currentMarker === '-'
    ) {
      if (tokenizers.thematicBreak.call(self, eat, line, true)) {
        break;
      }
    }

    const prevEmpty = empty;
    empty = !prefixed && !content?.trim()?.length;

    if (indented && item) {
      item.value = item.value.concat(emptyLines, line);
      allLines = allLines.concat(emptyLines, line);
      emptyLines = [];
    } else if (prefixed) {
      if (emptyLines.length !== 0) {
        spread = true;
        item.value.push('');
        item.trail = emptyLines.concat();
      }

      item = {
        value: [line],
        indent: size,
        trail: [],
      };

      items.push(item);
      allLines = allLines.concat(emptyLines, line);
      emptyLines = [];
    } else if (empty) {
      if (prevEmpty && !commonmark) {
        break;
      }

      emptyLines.push(line);
    } else {
      if (prevEmpty) {
        break;
      }

      if (interrupt(interuptors, tokenizers, self, [eat, line, true])) {
        break;
      }

      item.value = item.value.concat(emptyLines, line);
      allLines = allLines.concat(emptyLines, line);
      emptyLines = [];
    }

    index = nextIndex + 1;
  }

  const node = eat(allLines.join('\n')).reset({
    type: 'list',
    ordered: ordered,
    start: start,
    spread: spread,
    children: [],
  });
  const enterTop = self.enterList();
  const exitBlockquote = self.enterBlock();
  index = -1;
  length = items.length;

  while (++index < length) {
    item = items[index].value.join('\n');
    const now = eat.now();
    eat(item)(listItem(self, item, now, item.split(' ')[0]), node);

    item = items[index].trail.join('\n');

    if (index !== length - 1) {
      item += '\n';
    }

    eat(item);
  }

  enterTop();
  exitBlockquote();

  return node;
}

function listItem(ctx, value, position, marker) {
  const offsets = ctx.offset;
  const fn = ctx.options.pedantic ? pedanticListItem : normalListItem;
  let checked = null;
  let task;
  let indent;

  value = fn.call(null, ctx, value, position);

  if (ctx.options.gfm) {
    task = value.match(taskItemExpression);

    if (task) {
      indent = task[0].length;
      checked = task[1].toLowerCase() === 'x';
      offsets[position.line] += indent;
      value = value.slice(indent);
    }
  }

  return {
    type: 'listItem',
    marker,
    spread: looseListItemExpression.test(value),
    checked: checked,
    children: ctx.tokenizeBlock(value, position),
  };
}

// Create a list-item using overly simple mechanics.
function pedanticListItem(ctx, value, position) {
  const offsets = ctx.offset;
  let line = position.line;

  // Remove the list-item’s bullet.
  value = value.replace(pedanticBulletExpression, replacer);

  // The initial line was also matched by the below, so we reset the `line`.
  line = position.line;

  return value.replace(initialIndentExpression, replacer);

  // A simple replacer which removed all matches, and adds their length to
  // `offset`.
  function replacer($0) {
    offsets[line] = (offsets[line] || 0) + $0.length;
    line++;

    return '';
  }
}

// Create a list-item using sane mechanics.
function normalListItem(ctx, value, position) {
  const offsets = ctx.offset;
  let line = position.line;
  let max;
  let bullet;
  let rest;
  let lines;
  let trimmedLines;
  let index;
  let length;

  // Remove the list-item’s bullet.
  value = value.replace(bulletExpression, replacer);

  lines = value.split('\n');

  trimmedLines = removeIndent(value, getIndent(max).indent).split('\n');

  // We replaced the initial bullet with something else above, which was used
  // to trick `removeIndentation` into removing some more characters when
  // possible.  However, that could result in the initial line to be stripped
  // more than it should be.
  trimmedLines[0] = rest;

  offsets[line] = (offsets[line] || 0) + bullet.length;
  line++;

  index = 0;
  length = lines.length;

  while (++index < length) {
    offsets[line] =
      (offsets[line] || 0) + lines[index].length - trimmedLines[index].length;
    line++;
  }

  return trimmedLines.join('\n');

  function replacer($0, $1, $2, $3, $4) {
    bullet = $1 + $2 + $3;
    rest = $4;

    // Make sure that the first nine numbered list items can indent with an
    // extra space.  That is, when the bullet did not receive an extra final
    // space.
    if (Number($2) < 10 && bullet.length % 2 === 1) {
      $2 = ' ' + $2;
    }

    max = $1 + ' '.repeat($2.length) + $3;

    return max + rest;
  }
}


function interrupt(interruptors, tokenizers, ctx, params) {
  const length = interruptors.length;
  let index = -1;
  let interruptor;
  let config;

  while (++index < length) {
    interruptor = interruptors[index];
    config = interruptor[1] || {};

    if (
      config.pedantic !== undefined &&
      config.pedantic !== ctx.options.pedantic
    ) {
      continue;
    }

    if (
      config.commonmark !== undefined &&
      config.commonmark !== ctx.options.commonmark
    ) {
      continue;
    }

    if (tokenizers[interruptor[0]].apply(ctx, params)) {
      return true;
    }
  }

  return false;
}
