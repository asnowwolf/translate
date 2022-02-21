import { AbstractBlockNode } from './abstract-block-node';

export interface BlockNode extends AbstractBlockNode {
  blockname: string;

  content: string;

  lines: string[];

  getSource(): string;

  getSourceLines(): string[];
}
