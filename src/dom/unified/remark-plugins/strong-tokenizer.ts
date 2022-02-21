import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

const whitespace = require('is-whitespace-character');

const backslash = '\\';
const asterisk = '*';
const underscore = '_';

export function strongTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const self = this;
  let index = 0;
  let character = value.charAt(index);
  let now;
  let pedantic;
  let marker;
  let queue;
  let subvalue;
  let length;
  let prev;

  if (
    (character !== asterisk && character !== underscore) ||
    value.charAt(++index) !== character
  ) {
    return;
  }

  pedantic = self.options.pedantic;
  marker = character;
  subvalue = marker + marker;
  length = value.length;
  index++;
  queue = '';
  character = '';

  if (pedantic && whitespace(value.charAt(index))) {
    return;
  }

  while (index < length) {
    prev = character;
    character = value.charAt(index);

    if (
      character === marker &&
      value.charAt(index + 1) === marker &&
      (!pedantic || !whitespace(prev))
    ) {
      character = value.charAt(index + 2);

      if (character !== marker) {
        if (!queue.trim()) {
          return;
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true;
        }

        now = eat.now();
        now.column += 2;
        now.offset += 2;

        return eat(subvalue + queue + subvalue)({
          type: 'strong',
          marker,
          children: self.tokenizeInline(queue, now),
        });
      }
    }

    if (!pedantic && character === backslash) {
      queue += character;
      character = value.charAt(++index);
    }

    queue += character;
    index++;
  }
}


function locate(value, fromIndex) {
  const asterisk = value.indexOf('**', fromIndex);
  const underscore = value.indexOf('__', fromIndex);

  if (underscore === -1) {
    return asterisk;
  }

  if (asterisk === -1) {
    return underscore;
  }

  return underscore < asterisk ? underscore : asterisk;
}

strongTokenizer.locator = locate;
