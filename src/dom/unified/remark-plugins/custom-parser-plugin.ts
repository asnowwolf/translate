import { Processor } from 'unified';
import { emphasisTokenizer } from './emphasis-tokenizer';
import { strongTokenizer } from './strong-tokenizer';
import { listTokenizer } from './list-tokenizer';
import { ngInlineAtTokenizer } from './ng-inline-at-tokenizer';
import { BlockTokenizers, InlineTokenizers } from './unified-parser';
import { htmlRawTokenizer } from './html-raw-tokenizer';
import { htmlInlineExampleTokenizer } from './html-inline-example-tokenizer';
import { htmlCommentInlineTokenizer } from './html-comment-inline-tokenizer';
import { ngDocDirectiveTokenizer } from './ng-doc-directive-tokenizer';
import { htmlCommentBlockTokenizer } from './html-comment-block-tokenizer';

/**
 * Teach remark that some HTML blocks never include markdown
 */
export function customParser(this: Processor) {
  const processor = this;
  const Parser = processor.Parser;
  const blockTokenizers = Parser.prototype.blockTokenizers as BlockTokenizers;
  const blockMethods = Parser.prototype.blockMethods as string[];

  blockTokenizers.htmlRaw = htmlRawTokenizer;
  blockTokenizers.htmlComment = htmlCommentBlockTokenizer;
  blockTokenizers.ngDocDirective = ngDocDirectiveTokenizer;
  blockMethods.splice(blockMethods.indexOf('indentedCode'), 1);
  blockMethods.splice(blockMethods.indexOf('html'), 1, 'ngDocDirective', 'htmlRaw', 'htmlComment', 'anchor');
  blockTokenizers.list = listTokenizer;

  const inlineTokenizers = Parser.prototype.inlineTokenizers as InlineTokenizers;
  const inlineMethods = Parser.prototype.inlineMethods as string[];
  inlineTokenizers.htmlInlineExample = htmlInlineExampleTokenizer;
  inlineTokenizers.htmlComment = htmlCommentInlineTokenizer;
  inlineTokenizers.emphasis = emphasisTokenizer;
  inlineTokenizers.strong = strongTokenizer;
  inlineTokenizers.ngInlineAt = ngInlineAtTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('html'), 0, 'htmlInlineExample', 'htmlComment');
  inlineMethods.splice(inlineMethods.indexOf('emphasis'), 0, 'ngInlineAt');
}
