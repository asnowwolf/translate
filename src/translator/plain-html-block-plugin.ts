import { Processor } from 'unified';

/**
 * Teach remark that some HTML blocks never include markdown
 */
export function plainHTMLBlocks(this: Processor) {
  const processor = this;
  const Parser = processor.Parser;
  const blockTokenizers = Parser.prototype.blockTokenizers;
  const blockMethods = Parser.prototype.blockMethods;

  blockTokenizers.plainHTMLBlocks = tokenizePlainHTMLBlocks;
  blockMethods.splice(blockMethods.indexOf('html'), 0, 'plainHTMLBlocks');

  function tokenizePlainHTMLBlocks(this: { file: { fail: (message: string) => void } }, eat, value, silent) {
    const matches = /^<(code-example|code-tabs)[\s\S]+?<\/\1>$/.exec(value);
    if (matches) {
      try {
        if (silent || !matches) {
          // either we are not eating (silent) or the match failed
          return !!matches;
        }
        return eat(matches[0])({
          type: 'html',
          value: matches[0],
        });
      } catch (e) {
        this.file.fail('Unmatched plain HTML block tag ' + e.message);
      }
    }
  }
}
