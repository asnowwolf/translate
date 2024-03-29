import { Eater, UnifiedParser } from './unified-parser';
import { Node } from 'unist';

export function htmlRawTokenizer(this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined {
  const matches = /^<(code-example|code-examples|code-tabs)\b(.*?)>([\s\S]*?)<\/\1>/s.exec(value) ??
    /^( *)<div class=(["']?)filetree\2>.*?\n\1<\/div>/s.exec(value);
  if (matches) {
    try {
      if (silent || !matches) {
        // either we are not eating (silent) or the match failed
        return !!matches;
      }
      eat(matches[0])({
        type: 'htmlRaw',
        value: matches[0],
      });
    } catch (e: any) {
      this.file.fail('Unmatched plain HTML block tag: ' + e.message);
    }
  }
}
