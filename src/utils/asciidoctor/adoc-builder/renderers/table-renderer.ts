import { BlockNodeRenderer } from './block-node-renderer';
import { CellNode, ColumnNode, TableNode } from '../dom/table-node';

interface TableCellAttributes {
  width: number;
  colnumber: number;
  halign: string;
  valign: string;
  colpcwidth: number;
  style: string;
}

type TableColumnAttributes = TableCellAttributes;

export class TableRenderer extends BlockNodeRenderer<TableNode> {
  ignoredAttributeNames = ['colcount', 'rowcount', 'tablepcwidth'];

  protected getDefaultAttributes(node: TableNode): { [p: string]: any } {
    return { tablepcwidth: 100, style: 'table', options: 'header' };
  }

  protected getBlockTitle(node: TableNode): string | number {
    return node.getTitle();
  }

  protected renderBody(node: TableNode): string {
    const separator = node.getAttribute('separator') ?? '|';
    const content = renderRows(node);
    const delimiter = `|===`;
    if (content) {
      return [delimiter, content, delimiter].join('\n') + '\n';
    } else {
      return delimiter;
    }

    function columnOf(cell: CellNode): ColumnNode {
      return node.columns[+cell.getAttribute('colnumber') - 1];
    }

    function styleCharOf(cell: CellNode): string {
      const styleCharMap = {
        asciidoc: 'a',
        emphasis: 'e',
        header: 'h',
        literal: 'l',
        monospaced: 'm',
        default: 'd',
        strong: 's',
      };
      if (cell.style === columnOf(cell).style) {
        return '';
      }
      return styleCharMap[cell.style] ?? '';
    }

    function renderHeaderRows(rows: CellNode[][]): string {
      const text = rows.map(it => it.map(it => it.text).join(` ${separator}`)).filter(it => !!it).join('\n');
      return text && separator + text;
    }

    function renderBodyRows(rows: CellNode[][]): string {
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

      function hAlignOf(cell: CellNode): string {
        const cellAttributes = cell.getAttributes<TableCellAttributes>();
        const columnAttributes = columnOf(cell).getAttributes<TableColumnAttributes>();
        if (cellAttributes.halign === columnAttributes.halign) {
          return '';
        }

        return horizontalAlignmentChars[cellAttributes.halign] ?? '';
      }

      function vAlignOf(cell: CellNode): string {
        const cellAttributes = cell.getAttributes<TableCellAttributes>();
        const columnAttributes = columnOf(cell).getAttributes<TableColumnAttributes>();
        if (cellAttributes.valign === columnAttributes.valign) {
          return '';
        }
        return verticalAlignmentChars[cellAttributes.valign] ?? '';
      }

      function addEmptyLine(text: string): string {
        return text.replace(/\n\n(.*[^\n])$/gs, '\n\n$1\n');
      }

      function spanOf(node: CellNode): string {
        const colSpan = node.colspan > 1 ? `${node.colspan}` : '';
        const rowSpan = node.rowspan > 1 ? `.${node.rowspan}` : '';
        if (colSpan || rowSpan) {
          return `${colSpan}${rowSpan}+`;
        } else {
          return '';
        }
      }

      function renderCell(node: CellNode): string {
        return [
          spanOf(node),
          hAlignOf(node),
          vAlignOf(node),
          styleCharOf(node),
          separator,
          addEmptyLine(node.text),
        ].join('');
      }

      function renderRow(row: CellNode[], lastRow: boolean): string {
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
