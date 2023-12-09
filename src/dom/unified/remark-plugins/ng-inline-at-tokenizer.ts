import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

// Angular docs 内联的 @ 指令
export function ngInlineAtTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const matches = /^ *{@(\w+)\b([^}]*)}/.exec(value);
  if (matches) {
    try {
      if (silent || !matches) {
        // either we are not eating (silent) or the match failed
        return !!matches;
      }
      return eat(matches[0])({
        type: 'ngInlineAt',
        name: matches[1],
        value: matches[2],
      });
    } catch (e: any) {
      this.file.fail('Unmatched @ tag: ' + e.message);
    }
  }
}


function locate(value: string, fromIndex: number): number {
  const pattern = / *{@(\w+)\b([^}]*)}/;
  pattern.lastIndex = fromIndex;
  return value.search(pattern);
}

ngInlineAtTokenizer.locator = locate;
