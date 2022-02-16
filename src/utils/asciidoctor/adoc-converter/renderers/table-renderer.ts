import { CellNode, TableNode } from './dom/models';
import { BlockNodeRenderer } from './block-node-renderer';

interface TableCellAttributes {
  width: number;
  colnumber: number;
  halign: string;
  valign: string;
  colpcwidth: number;
  style: string;
}

function styleCharOf(it: CellNode): string {
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

      function hAlignOf(attributes: TableCellAttributes): string {
        return horizontalAlignmentChars[attributes.halign] ?? '';
      }

      function vAlignOf(attributes: TableCellAttributes): string {
        return verticalAlignmentChars[attributes.valign] ?? '';
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
        const attributes = node.getAttributes<TableCellAttributes>();
        return [
          spanOf(node),
          hAlignOf(attributes),
          vAlignOf(attributes),
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
