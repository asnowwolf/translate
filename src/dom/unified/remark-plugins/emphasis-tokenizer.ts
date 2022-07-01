'use strict';

import { Node } from 'unist';
import { Eater, UnifiedParser } from './unified-parser';

const word = require('is-word-character');
const whitespace = require('is-whitespace-character');

export function emphasisTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  let index = 0;
  let character = value.charAt(index);

  if (character !== '*' && character !== '_') {
    return;
  }

  const pedantic = this.options.pedantic;
  const subvalue = character;
  const marker = character;
  const length = value.length;
  index++;
  let queue = '';
  character = '';

  if (pedantic && whitespace(value.charAt(index))) {
    return;
  }

  while (index < length) {
    const prev = character;
    character = value.charAt(index);

    if (character === marker && (!pedantic || !whitespace(prev))) {
      character = value.charAt(++index);

      if (character !== marker) {
        if (!queue.trim() || prev === marker) {
          return;
        }

        if (!pedantic && marker === '_' && word(character)) {
          queue += marker;
          continue;
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true;
        }

        const now = eat.now();
        now.column++;
        now.offset++;

        return eat(subvalue + queue + marker)({
          type: 'emphasis',
          marker,
          children: this.tokenizeInline(queue, now),
        });
      }

      queue += marker;
    }

    if (!pedantic && character === '\\') {
      queue += character;
      character = value.charAt(++index);
    }

    queue += character;
    index++;
  }
}

emphasisTokenizer.locator = function (value, fromIndex) {
  const asterisk = value.indexOf('*', fromIndex);
  const underscore = value.indexOf('_', fromIndex);

  if (underscore === -1) {
    return asterisk;
  }

  if (asterisk === -1) {
    return underscore;
  }

  return underscore < asterisk ? underscore : asterisk;
};
