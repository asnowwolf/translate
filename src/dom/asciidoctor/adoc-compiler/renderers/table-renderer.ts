import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import Table = Asciidoctor.Table;
import Cell = Asciidoctor.Table.Cell;
import Column = Asciidoctor.Table.Column;

export class TableRenderer extends BlockNodeRenderer<Table> {
  ignoredAttributeNames = ['colcount', 'rowcount', 'tablepcwidth'];

  protected getDefaultAttributes(node: Table): { [p: string]: any } {
    return { tablepcwidth: 100, style: 'table', options: 'header' };
  }

  protected getBlockTitle(node: Table): string | number {
    return node.getTitle();
  }

  protected renderBody(node: Table): string {
    const separator = node.getAttribute('separator') ?? '|';
    const content = renderRows(node);
    const delimiter = `|===`;
    if (content) {
      return [delimiter, content, delimiter].join('\n') + '\n';
    } else {
      return delimiter;
    }

    function columnOf(cell: Cell): Column {
      return cell.getColumn();
    }

    function styleCharOf(cell: Cell): string {
      const styleCharMap = {
        asciidoc: 'a',
        emphasis: 'e',
        header: 'h',
        literal: 'l',
        monospaced: 'm',
        default: 'd',
        strong: 's',
      };
      if (cell.getStyle() === columnOf(cell).getStyle()) {
        return '';
      }
      return styleCharMap[cell.getStyle()] ?? '';
    }

    function escapeSeparator(text: string): string {
      const separator = node.getAttribute('separator') as string ?? '|';
      return text.replace(new RegExp(`[${separator}]`, 'g'), '\\' + separator);
    }

    function renderHeaderRows(rows: Cell[][]): string {
      const text = rows.map(it => it.map(it => escapeSeparator(it.getText())).join(` ${separator}`)).filter(it => !!it).join('\n');
      return text && separator + text;
    }

    function renderBodyRows(rows: Cell[][]): string {
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

      function hAlignOf(cell: Cell): string {
        const cellAttributes = cell.getAttributes();
        const columnAttributes = (columnOf(cell) as any).getAttributes();
        if (cellAttributes.halign === columnAttributes.halign) {
          return '';
        }

        return horizontalAlignmentChars[cellAttributes.halign] ?? '';
      }

      function vAlignOf(cell: Cell): string {
        const cellAttributes = cell.getAttributes();
        const columnAttributes = columnOf(cell).getAttributes();
        if (cellAttributes.valign === columnAttributes.valign) {
          return '';
        }
        return verticalAlignmentChars[cellAttributes.valign] ?? '';
      }

      function addEmptyLine(text: string): string {
        return text.replace(/\n\n(.*[^\n])$/gs, '\n\n$1\n');
      }

      function spanOf(node: Cell): string {
        const colSpan = node.getColumnSpan() > 1 ? `${node.getColumnSpan()}` : '';
        const rowSpan = node.getRowSpan() > 1 ? `.${node.getRowSpan()}` : '';
        if (colSpan || rowSpan) {
          return `${colSpan}${rowSpan}+`;
        } else {
          return '';
        }
      }

      function renderCell(node: Cell): string {
        return [
          spanOf(node),
          hAlignOf(node),
          vAlignOf(node),
          styleCharOf(node),
          separator,
          addEmptyLine(escapeSeparator(node.getText())),
        ].join('');
      }

      function renderRow(row: Cell[], lastRow: boolean): string {
        const rowText = row.map(it => renderCell(it)).join('\n');
        return lastRow ? rowText : rowText.trim();
      }

      return rows.map((row, rowIndex) => renderRow(row, rowIndex === rows.length - 1)).filter(it => !!it).join('\n\n');
    }

    function renderRows(node: Table): string {
      return [
        renderHeaderRows(node.getRows().head),
        renderBodyRows([...node.getRows().body, ...node.getRows().foot]),
      ].filter(it => !!it).join('\n\n');
    }
  }
}
