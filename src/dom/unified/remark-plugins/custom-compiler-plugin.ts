import { Processor } from 'unified';
import { strongVisitor } from './strong-visitor';
import { emphasisVisitor } from './emphasis-visitor';
import { listItemVisitor } from './list-item-visitor';
import { anchorVisitor } from './anchor-visitor';
import { UnifiedParser, Visitor, Visitors } from './unified-parser';
import { originalIdVisitor } from './original-id-visitor';
import { Node, Position } from 'unist';
import { htmlCommentVisitor } from './html-comment-visitor';
import { htmlRawVisitor } from './html-raw-visitor';
import { htmlTagVisitor } from './html-tag-visitor';
import { ngDocDirectiveVisitor } from './ng-doc-directive-visitor';

function createTableCellVisitor(tableCell: Visitor): Visitor {
  return function (this: UnifiedParser, node: Node, parent?: Node, position?: Position, bullet?: string): string {
    const text = tableCell.call(this, node, parent, position, bullet);
    return text.replace(/\n/g, '&NewLine;').replace(/\\\|/g, '&verbar;');
  };
}

/**
 * Teach remark that some HTML blocks never include markdown
 */
export function customCompiler(this: Processor) {
  const processor = this;
  const Compiler = processor.Compiler;
  const visitors = Compiler.prototype.visitors as Visitors;

  visitors.listItem = listItemVisitor;
  visitors.strong = strongVisitor;
  visitors.emphasis = emphasisVisitor;
  visitors.anchor = anchorVisitor;
  visitors['comment'] = htmlCommentVisitor;
  visitors['htmlRaw'] = htmlRawVisitor;
  visitors['htmlTag'] = htmlTagVisitor;
  visitors.originalId = originalIdVisitor;
  visitors.tableCell = createTableCellVisitor(visitors.tableCell);
  visitors.ngDocDirective = ngDocDirectiveVisitor;
}

