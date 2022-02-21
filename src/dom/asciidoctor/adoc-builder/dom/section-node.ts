import { AbstractBlockNode } from './abstract-block-node';

export interface SectionNode extends AbstractBlockNode {
  getIndex(): number;

  setIndex(index: number): void;

  getSectionName(): string;

  setSectionName(name: string): void;

  isSpecial(): boolean;

  setSpecial(special: boolean): void;

  isNumbered(): boolean;

  getName(): string;
}
