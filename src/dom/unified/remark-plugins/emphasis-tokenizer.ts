'use strict';

import { Node } from 'unist';
import { Eater, UnifiedParser } from './unified-parser';

const word = require('is-word-character');
const whitespace = require('is-whitespace-character');

const asterisk = '*';
const underscore = '_';
const backslash = '\\';

export function emphasisTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const self = this;
  let index = 0;
  let character = value.charAt(index);

  if (character !== asterisk && character !== underscore) {
    return;
  }

  const pedantic = self.options.pedantic;
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

        if (!pedantic && marker === underscore && word(character)) {
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
          children: self.tokenizeInline(queue, now),
        });
      }

      queue += marker;
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
  const asterisk = value.indexOf('*', fromIndex);
  const underscore = value.indexOf('_', fromIndex);

  if (underscore === -1) {
    return asterisk;
  }

  if (asterisk === -1) {
    return underscore;
  }

  return underscore < asterisk ? underscore : asterisk;
}

emphasisTokenizer.locator = locate;
