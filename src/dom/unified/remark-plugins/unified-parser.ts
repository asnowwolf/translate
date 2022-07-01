import { Node, Point, Position } from 'unist';
import { Root } from 'mdast';

export interface UnifiedParser {
  tree: Root;
  interruptList: any[];
  blockTokenizers: BlockTokenizers;
  options: any;
  file: { fail: (message: string) => void };

  tokenizeInline(queue: string, now: Point): Node[];

  enterList(): () => void;

  enterBlock(): () => void;

  visit(child: Node, node: Node): string;

  all(node: Node): string[];

  encode(escape: any, node: Node): string;

  escape(value: any, node: Node, parent: Node): string;

  tokenizeBlock(match: string, point: Point): Node[];

  block(node: Node): string;
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
  htmlComment: Tokenizer;
  ngDocDirective: Tokenizer;
  admonition: Tokenizer;
  thematicBreak: Tokenizer;
  anchor: Tokenizer;
  list: Tokenizer;
  htmlBlock: Tokenizer;
}

export interface InlineTokenizers {
  htmlClosingTag: Tokenizer;
  htmlSelfClosingTag: Tokenizer;
  htmlComment: Tokenizer;
  emphasis: Tokenizer;
  strong: Tokenizer;
  originalId: Tokenizer;
  htmlInlineExample: Tokenizer;
}

export interface Visitor {
  (this: UnifiedParser, node: Node, parent?: Node, position?: Position, bullet?: string): string;
}

export interface Visitors {
  ngDocDirective: Visitor;
  link: Visitor;
  htmlRaw: Visitor;
  tableCell: Visitor;
  listItem: Visitor;
  strong: Visitor;
  emphasis: Visitor;
  anchor: Visitor;
  htmlBlock: Visitor;
  htmlInline: Visitor;
  originalId: Visitor;
}
