import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

const pattern = /^<(code-example|live-example)[\s\S]+?<\/\1>/;

export function htmlInlineExampleTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const matches = pattern.exec(value);
  if (matches) {
    try {
      if (silent || !matches) {
        // either we are not eating (silent) or the match failed
        return !!matches;
      }
      return eat(matches[0])({
        type: 'htmlRaw',
        value: matches[0],
      });
    } catch (e: any) {
      this.file.fail('Unmatched plain HTML inline tag: ' + e.message);
    }
  }
}

htmlInlineExampleTokenizer.locator = (value: string, fromIndex: number): number => {
  const searchFromIndexPattern = new RegExp(pattern);
  searchFromIndexPattern.lastIndex = fromIndex;
  return value.search(searchFromIndexPattern);
};
