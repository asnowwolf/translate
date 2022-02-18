import { AbstractNode } from './abstract-node';

export interface InlineNode extends AbstractNode {
  convert(): string;

  getText(): string;

  getType(): string;

  getTarget(): string;

  $render(): string;

  alt: string;

  reftext: string;
}
