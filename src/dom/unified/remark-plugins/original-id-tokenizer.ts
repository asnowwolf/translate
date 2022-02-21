import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

// 翻译原文 id
export function originalIdTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const matches = /^ *{@originalId (.*?)}/.exec(value);
  if (matches) {
    try {
      if (silent || !matches) {
        // either we are not eating (silent) or the match failed
        return !!matches;
      }
      return eat(matches[0])({
        type: 'originalId',
        value: matches[1],
      });
    } catch (e) {
      this.file.fail('Unmatched originalId tag: ' + e.message);
    }
  }
}


function locate(value: string, fromIndex: number): number {
  const pattern = / *{@originalId (.*?)}/;
  pattern.lastIndex = fromIndex;
  return value.search(pattern);
}

originalIdTokenizer.locator = locate;
