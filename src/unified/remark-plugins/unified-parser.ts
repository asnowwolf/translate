import { Node, Point, Position } from 'unist';

export interface UnifiedParser {
  interruptList: any[];
  blockTokenizers: BlockTokenizers;
  options: any;
  file: { fail: (message: string) => void };

  tokenizeInline(queue: string, now: Point): Node[];

  enterList(): () => void;

  enterBlock(): () => void;

  visit(child: Node, node: Node): string;

  all(node: Node): string[];
}

interface NodeFactory {
  (node: Node, parent?: Node): Node;

  reset(node: Node): Node;
}

export interface Eater {
  (subValue: string): NodeFactory;

  now(): Point;
}

export interface Tokenizer {
  (this: UnifiedParser, eat: Eater, value: string, silent?: boolean): Node | boolean | undefined;
}

export interface BlockTokenizers {
  thematicBreak: Tokenizer;
  plainHtml: Tokenizer;
  anchor: Tokenizer;
  list: Tokenizer;
}

export interface InlineTokenizers {
  emphasis: Tokenizer;
  strong: Tokenizer;
  originalId: Tokenizer;
}

interface Visitor {
  (this: UnifiedParser, node: Node, parent?: Node, position?: Position, bullet?: string): string;
}

export interface Visitors {
  listItem: Visitor;
  strong: Visitor;
  emphasis: Visitor;
  anchor: Visitor;
  plainHtml: Visitor;
  originalId: Visitor;
}
