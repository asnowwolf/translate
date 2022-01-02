import { Processor } from 'unified';
import { plainHtmlTokenizer } from './plain-html-tokenizer';
import { emphasisTokenizer } from './emphasis-tokenizer';
import { strongTokenizer } from './strong-tokenizer';
import { listTokenizer } from './list-tokenizer';
import { anchorTokenizer } from './anchor-tokenizer';

/**
 * Teach remark that some HTML blocks never include markdown
 */
export function customParser(this: Processor) {
  const processor = this;
  const Parser = processor.Parser;
  const blockTokenizers = Parser.prototype.blockTokenizers;
  const blockMethods = Parser.prototype.blockMethods;

  blockTokenizers.plainHtml = plainHtmlTokenizer;
  blockTokenizers.anchor = anchorTokenizer;
  blockMethods.splice(blockMethods.indexOf('html'), 0, 'plainHtml');
  blockMethods.splice(blockMethods.indexOf('newline'), 0, 'anchor');
  blockTokenizers.list = listTokenizer;

  const inlineTokenizers = Parser.prototype.inlineTokenizers;
  inlineTokenizers.emphasis = emphasisTokenizer;
  inlineTokenizers.strong = strongTokenizer;
}
