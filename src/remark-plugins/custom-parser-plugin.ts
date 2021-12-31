import { Processor } from 'unified';
import { plainHTMLBlocksTokenizer } from './plain-html-blocks-tokenizer';
import { emphasisTokenizer } from './emphasis-tokenizer';
import { strongTokenizer } from './strong-tokenizer';
import { listTokenizer } from './list-tokenizer';

/**
 * Teach remark that some HTML blocks never include markdown
 */
export function customParser(this: Processor) {
  const processor = this;
  const Parser = processor.Parser;
  const blockTokenizers = Parser.prototype.blockTokenizers;
  const blockMethods = Parser.prototype.blockMethods;

  blockTokenizers.plainHTMLBlocks = plainHTMLBlocksTokenizer;
  blockMethods.splice(blockMethods.indexOf('html'), 0, 'plainHTMLBlocks');
  blockTokenizers.list = listTokenizer;

  const inlineTokenizers = Parser.prototype.inlineTokenizers;
  inlineTokenizers.emphasis = emphasisTokenizer;
  inlineTokenizers.strong = strongTokenizer;
}
