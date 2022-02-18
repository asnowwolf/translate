import { AbstractNode } from './abstract-node';
import { AttributeValue } from './attribute-value';
import { ContentModel } from './content-model';

export interface AbstractBlockNode extends AbstractNode {
  append(block: AbstractBlockNode): void;

  applySubstitutions(text: string, subs: string[]): string;

  getTitle(): string;

  getCaptainedTitle(): string;

  getStyle(): string;

  getCaption(): string;

  setCaption(caption: string): void;

  getLevel(): number;

  getSubstitutions(): string[];

  hasSubstitution(substitution: string): boolean;

  removeSubstitution(substitution: string): void;

  hasBlocks(): boolean;

  getBlocks(): AbstractBlockNode[];

  getContent(): string;

  convert(options?: { [key: string]: AttributeValue }): string;

  findBy(selector: string, block: boolean): AbstractNode[];

  getLineNumber(): number;

  hasSections(): boolean;

  getSections(): AbstractBlockNode[];

  getNumeral(): string;

  setNumeral(numeral: string): void;

  hasTitle(): boolean;

  content_model: ContentModel;

  source_location: string;

  subs: string[];

  xreftext: string;

  lines: string[];
}
