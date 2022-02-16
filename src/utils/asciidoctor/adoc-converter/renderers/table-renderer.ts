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

export class TableRenderer extends BlockNodeRenderer<TableNode> {
  ignoredAttributeNames = ['colcount', 'rowcount', 'tablepcwidth'];

  protected getDefaultAttributes(node: TableNode): { [p: string]: any } {
    return { tablepcwidth: 100, style: 'table', options: 'header' };
  }

  protected renderBody(node: TableNode): string {
    const separator = node.getAttribute('separator') ?? '|';
    const content = renderRows(node);
    const delimiter = `|===`;
    if (content) {
      return [delimiter, content, delimiter].join('\n');
    } else {
      return delimiter;
    }

    function renderHeaderRows(rows: TableCellNode[][]): string {
      const text = rows.map(it => it.map(it => it.text).join(` ${separator}`)).filter(it => !!it).join('\n');
      return text && separator + text;
    }

    function renderBodyRows(rows: TableCellNode[][]): string {
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

      function hAlignOf(node: TableCellNode): string {
        return horizontalAlignmentChars[node.getAttributes().halign] ?? '';
      }

      function vAlignOf(node: TableCellNode): string {
        return verticalAlignmentChars[node.getAttributes().valign] ?? '';
      }

      function addEmptyLine(text: string): string {
        return text.replace(/\n\n(.*[^\n])$/gs, '\n\n$1\n');
      }

      function spanOf(node: TableCellNode): string {
        const colSpan = node.colspan > 1 ? `${node.colspan}` : '';
        const rowSpan = node.rowspan > 1 ? `.${node.rowspan}` : '';
        if (colSpan || rowSpan) {
          return `${colSpan}${rowSpan}+`;
        } else {
          return '';
        }
      }

      function renderCell(node: TableCellNode): string {
        return [
          spanOf(node),
          hAlignOf(node),
          vAlignOf(node),
          styleCharOf(node),
          separator,
          addEmptyLine(node.text),
        ].join('');
      }

      function renderRow(row: TableCellNode[], lastRow: boolean): string {
        const rowText = row.map(it => renderCell(it)).join('\n');
        return lastRow ? rowText : rowText.trim();
      }

      return rows.map((row, rowIndex) => renderRow(row, rowIndex === rows.length - 1)).filter(it => !!it).join('\n\n');
    }

    function renderRows(node: TableNode): string {
      return [
        renderHeaderRows(node.rows.head),
        renderBodyRows([...node.rows.body, ...node.rows.foot]),
      ].filter(it => !!it).join('\n\n');
    }
  }
}
