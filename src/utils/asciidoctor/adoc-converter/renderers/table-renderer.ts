import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';

interface TableCellAttributes {
  width: number;
  colnumber: number;
  halign: string;
  valign: string;
  colpcwidth: number;
  style: string;
}

type TableColumnAttributes = TableCellAttributes;

interface TableCellNode extends AdocNode {
  getAttributes(): TableCellAttributes;

  text: string;
  colspan: number;
  rowspan: number;
  style: string;
}

function styleCharOf(it: TableCellNode): string {
  const styleCharMap = {
    asciidoc: 'a',
    emphasis: 'e',
    header: 'h',
    literal: 'l',
    monospaced: 'm',
    default: 'd',
    strong: 's',
  };
  return styleCharMap[it.style] ?? '';
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
  const horizontalAlignmentChars = {
    left: '',
    right: '>',
    center: '^',
  };
  const verticalAlignmentChars = {
    top: '',
    bottom: '.>',
    middle: '.^',
  };

  function hAlignOf(it: TableCellNode): string {
    return horizontalAlignmentChars[it.getAttributes().halign] ?? '';
  }

  function vAlignOf(it: TableCellNode): string {
    return verticalAlignmentChars[it.getAttributes().valign] ?? '';
  }

  function addEmptyLine(text: string): string {
    return text.replace(/\n\n(.*[^\n])$/gs, '\n\n$1\n');
  }

  function renderCell(it: TableCellNode): string {
    return `${hAlignOf(it)}${vAlignOf(it)}${styleCharOf(it)}|${addEmptyLine(it.text)}`;
  }

  function renderRow(row: TableCellNode[], lastRow: boolean): string {
    const rowText = row.map(it => renderCell(it)).join('\n');
    return lastRow ? rowText : rowText.trim();
  }

  return rows.map((row, rowIndex) => renderRow(row, rowIndex === rows.length - 1)).filter(it => !!it).join('\n\n');
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
