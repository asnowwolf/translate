import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

function renderAttributes(attributes: Asciidoctor.Table.ColumnAttributes | Asciidoctor.Table.CellAttributes): string {
  return Object.entries(attributes).map(([key, value]) => `data-${key}="${value}"`).join(' ');
}

function renderCellSpans(cell: Asciidoctor.Table.Cell): string {
  const colSpan = cell.getColumnSpan();
  const rowSpan = cell.getRowSpan();
  const result = [colSpan && `data-colspan=${colSpan}`, rowSpan && `data-rowspan=${rowSpan}`].filter(it => !!it).join(' ');
  return result && `${result} `;
}

export class TinyTableRenderer extends BaseTinyNodeRenderer<Asciidoctor.Table> {
  tagName = 'table';

  protected getContent(node: Asciidoctor.Table): string {
    return [
      this.renderCaption(node),
      this.renderColGroups(node.getColumns()),
      this.renderHeads(node.getHeadRows()),
      this.renderBody(node.getBodyRows()),
      this.renderFoots(node.getFootRows()),
    ].filter(it => !!it).join('');
  }

  private renderCaption(node: Asciidoctor.Table) {
    return node.getCaption().toString() ? `<caption>${node.getCaption()}</caption>` : '';
  }

  private renderHeads(rows: Asciidoctor.Table.Cell[][]): string {
    const result = rows.map(row => `<tr>${this.renderRow(row, 'th')}</tr>`).join('');
    return rows.length > 0 ? `<thead>${result}</thead>` : '';
  }

  private renderBody(rows: Asciidoctor.Table.Cell[][]): string {
    const result = rows.map(row => `<tr>${this.renderRow(row, 'td')}</tr>`).join('');
    return rows.length > 0 ? `<tbody>${result}</tbody>` : '';
  }

  private renderFoots(rows: Asciidoctor.Table.Cell[][]): string {
    const result = rows.map(row => `<tr>${this.renderRow(row, 'td')}</tr>`).join('');
    return rows.length > 0 ? `<tfoot>${result}</tfoot>` : '';
  }

  private renderColGroups(columns: Asciidoctor.Table.Column[]): string {
    const result = columns.map(column => `<col ${renderAttributes(column.getAttributes())}/>`).join('');
    return `<colgroup>${result}</colgroup>`;
  }

  private renderRow(row: Asciidoctor.Table.Cell[], tagName: string): string {
    return row.map(cell => `<${tagName} ${renderCellSpans(cell)}${renderAttributes(cell.getAttributes())}>${cell.getContent()}</${tagName}>`).join('');
  }
}
