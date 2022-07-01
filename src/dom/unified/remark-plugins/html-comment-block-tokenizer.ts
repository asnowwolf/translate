import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

const pattern = /^<!--(.*?)-->/s;

export function htmlCommentBlockTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const matches = pattern.exec(value);
  if (matches) {
    try {
      if (silent || !matches) {
        // either we are not eating (silent) or the match failed
        return !!matches;
      }
      return eat(matches[0])({
        type: 'comment',
        value: matches[1],
      });
    } catch (e: any) {
      this.file.fail('Unmatched plain HTML inline tag: ' + e.message);
    }
  }
}
