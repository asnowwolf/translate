import { Processor } from 'unified';
import { strongVisitor } from './strong-visitor';
import { emphasisVisitor } from './emphasis-visitor';
import { listItemVisitor } from './list-item-visitor';

/**
 * Teach remark that some HTML blocks never include markdown
 */
export function customCompiler(this: Processor) {
  const processor = this;
  const Compiler = processor.Compiler;
  const visitors = Compiler.prototype.visitors;

  visitors.listItem = listItemVisitor;
  visitors.strong = strongVisitor;
  visitors.emphasis = emphasisVisitor;
}

