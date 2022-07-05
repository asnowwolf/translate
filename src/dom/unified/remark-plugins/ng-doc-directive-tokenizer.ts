import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

export function ngDocDirectiveTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const matches = /^@(.*)/.exec(value);
  if (matches) {
    try {
      if (silent || !matches) {
        // either we are not eating (silent) or the match failed
        return !!matches;
      }
      return eat(matches[0])({
        type: 'ngDocDirective',
        value: matches[1],
      });
    } catch (e: any) {
      this.file.fail('Unmatched anchor tag: ' + e.message);
    }
  }
}