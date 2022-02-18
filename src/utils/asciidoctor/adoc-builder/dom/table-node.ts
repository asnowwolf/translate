import { AbstractNode } from './abstract-node';
import { DocumentNode } from './document-node';
import { AbstractBlockNode } from './abstract-block-node';

export interface TableNode extends AbstractBlockNode {
  rows: Rows;

  columns: ColumnNode[];

  has_header_option: boolean;

  caption: string;
}

export interface Rows {
  head: CellNode[][];

  body: CellNode[][];

  foot: CellNode[][];
}

export interface ColumnNode extends AbstractNode {
  style: string;

  table: TableNode;

  $assign_width(col_pcwidth, width_base, pf): void;
}

export interface CellNode extends AbstractNode {
  source_location: any;

  style: string;

  subs: string[];

  colspan: number;

  rowspan: number;

  column: ColumnNode;

  inner_document: DocumentNode;

  text: string;

  content: string;

  file: string;

  lineno: number;
}
