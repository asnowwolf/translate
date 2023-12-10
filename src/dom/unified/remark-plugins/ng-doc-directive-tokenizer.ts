import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

export function ngDocDirectiveTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const matches = /^@(\w+)\b(.*)/.exec(value);
  if (matches) {
    try {
      if (silent || !matches) {
        // either we are not eating (silent) or the match failed
        return !!matches;
      }
      return eat(matches[0])({
        type: 'ngDocDirective',
        name: matches[1],
        value: matches[2]?.trim(),
      });
    } catch (e: any) {
      this.file.fail('Unmatched ngDocDirective: ' + e.message);
    }
  }
}
