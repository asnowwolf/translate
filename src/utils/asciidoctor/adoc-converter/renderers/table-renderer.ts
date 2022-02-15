import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface TableCellAttributes {
  width: number;
  colnumber: number;
  halign: string;
  valign: string;
  colpcwidth: number;
}

type TableColumnAttributes = TableCellAttributes;

interface TableCellNode extends AdocNode {
  getAttributes(): TableCellAttributes;

  text: string;
}

interface TableRows {
  head: TableCellNode[][];
  foot: TableCellNode[][];
  body: TableCellNode[][];
}

interface TableColumnNode extends AdocNode {
  getAttributes(): TableColumnAttributes;
}

interface TableNode extends AdocNode {
  has_header_option: boolean;
  rows: TableRows;
  columns: TableColumnNode[];
}

function renderHeader(rows: TableCellNode[][]): string {
  const text = rows.map(it => it.map(it => it.text).join(' |')).filter(it => !!it).join('\n');
  return text && '|' + text;
}

function renderBody(rows: TableCellNode[][]): string {
  const alignmentChars = {
    left: '<',
    right: '>',
    center: '^',
  };
  return rows.map(it => it.map(it => `${alignmentChars[it.getAttributes().halign]}|${it.text}`).join('\n')).filter(it => !!it).join('\n\n');
}

function renderRows(node: TableNode): string {
  return [
    renderHeader(node.rows.head),
    renderBody([...node.rows.body, ...node.rows.foot]),
  ].filter(it => !!it).join('\n\n');
}

export class TableRenderer extends BlockNodeRenderer<TableNode> {
  ignoredAttributeNames = ['colcount', 'rowcount', 'header-option', 'footer-option'];

  protected getDefaultAttributes(node: TableNode): { [p: string]: any } {
    return { tablepcwidth: 100, style: 'table', options: 'header' };
  }

  protected renderBody(node: TableNode): string {
    const content = renderRows(node);
    if (content) {
      return [`|===`, content, '|==='].join('\n');
    } else {
      return `|===`;
    }
  }
}
