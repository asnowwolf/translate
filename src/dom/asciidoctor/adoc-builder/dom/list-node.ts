import { AbstractBlockNode } from './abstract-block-node';
import { InlineNode } from './inline-node';

export interface ListItemNode extends InlineNode {
  getBlocks(): AbstractBlockNode[];

  setText(text: string): void;

  list: ListNode;

  marker: string;
}

export interface ListNode extends AbstractBlockNode {
  getTitle(): string;

  getItems<T = ListItemNode>(): T[];

  $content: string;

  $render(): string;
}
