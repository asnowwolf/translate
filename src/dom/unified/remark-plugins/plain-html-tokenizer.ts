import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

export function plainHtmlTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const matches = /^<(code-example|code-tabs)[\s\S]+?<\/\1>/.exec(value);
  if (matches) {
    try {
      if (silent || !matches) {
        // either we are not eating (silent) or the match failed
        return !!matches;
      }
      return eat(matches[0])({
        type: 'plainHtml',
        value: matches[0],
      });
    } catch (e: any) {
      this.file.fail('Unmatched plain HTML block tag: ' + e.message);
    }
  }
}
