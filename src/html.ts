import * as slugs from 'github-slugger';
import { containsChinese } from './common';
import { DomElement, DomParentNode, DomSelector, DomTableElement, DomTableRowElement } from './models/dom-models';

export namespace html {
  const elementSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 't'].map(it => (node: DomElement) => node.isTagOf(it));
  const attributeSelector = (node: DomElement) => node.hasAttribute('ng-should-translate');
  export const defaultSelectors = [...elementSelectors, attributeSelector];

  export interface SentencePair {
    english: DomElement;
    chinese: DomElement;
  }

  function toId(slugger, text) {
    return slugger.slug(text);
  }

  export function addIdForHeaders(body: DomParentNode): void {
    const headers = body.querySelectorAll<DomElement>(it => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(it.nodeName));
    const slugger = slugs();
    headers.forEach(header => {
      if (!header.hasAttribute('id')) {
        header.setAttribute('id', toId(slugger, header.textContent));
      }
    });
  }

  export function markAndSwapAll(body: DomParentNode, selectors: DomSelector[] = defaultSelectors): void {
    restructureTable(body);
    selectors.forEach(selectors => markAndSwap(body, selectors));
  }

  function clearAiraHidden(body: DomParentNode): void {
    const hiddens = body.querySelectorAll<DomElement>(it => it.hasAttribute('aria-hidden'));
    hiddens.forEach(element => element.remove());
  }

  export function extractAll(body: DomParentNode): SentencePair[] {
    clearAiraHidden(body);
    const resultElements = body.querySelectorAll(it => it.previousElementSibling?.hasAttribute('translation-result') && it.hasAttribute('translation-origin'));
    const results: SentencePair[] = [];
    resultElements.forEach(origin => {
      const result = origin.previousElementSibling!;
      if (!containsChinese(origin.textContent!)) {
        results.push({ english: origin, chinese: result });
      }
    });
    return results;
  }

  function isPaired(prev: DomElement, element: DomElement): boolean {
    return prev && prev.nextElementSibling === element &&
      prev.isTagOf(element.tagName) && prev.className === element.className;
  }

  export function markAndSwap(element: DomParentNode, selector: DomSelector): void {
    const elements = element.querySelectorAll(selector);
    elements.forEach(element => {
      if (containsChinese(element.innerHTML)) {
        const prev = element.previousElementSibling!;
        if (isPaired(prev, element) && !containsChinese(prev.innerHTML)) {
          element.setAttribute('translation-result', 'on');
          prev.setAttribute('translation-origin', 'off');
          element.parentNode.insertBefore(element, prev);
          // 交换 id，中文内容应该占用原文的 id
          const id = prev.getAttribute('id');
          if (id) {
            prev.removeAttribute('id');
            element.setAttribute('id', id);
          }
          const href = prev.getAttribute('href');
          if (href) {
            element.setAttribute('href', href);
          }
          if (element.isTagOf('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li')) {
            const prevAnchor = prev.querySelector(it => it.isTagOf('a') && it.hasAttribute('href'));
            const thisAnchor = element.querySelector(it => it.isTagOf('a') && it.hasAttribute('href'));
            if (prevAnchor && thisAnchor && containsChinese(decodeURIComponent(thisAnchor.getAttribute('href')!)!)) {
              thisAnchor.setAttribute('href', prevAnchor.getAttribute('href')!);
            }
          }
        }
      }
    });
  }

  function shouldMergeTable(element: DomTableElement): boolean {
    return element.getAttribute('translation-merge-rows') === 'no';
  }

  function shouldMergeRow(element: DomTableRowElement): boolean {
    if (element.getAttribute('translation-merge-rows') === 'no') {
      return false;
    }
    // 如果内部有 p 元素，则禁止自动合并
    for (let i = 0; i < element.cells.length; ++i) {
      if (element.cells[i].querySelector(it => it.isTagOf('p'))) {
        return false;
      }
    }
    return true;
  }

// 重塑表格结构
  export function restructureTable(element: DomParentNode): void {
    const items = element.querySelectorAll(it => it.isTagOf('table'));
    items.forEach(table => {
      if (shouldMergeTable(table)) {
        return;
      }
      // 对出现在 thead 的行和出现在 tbody 的行进行统一处理
      const rows = table.querySelectorAll(it => it.isTagOf('tr'));
      const translationRows: DomElement[] = [];
      for (let i = 0; i < rows.length - 1; ++i) {
        const thisRow = rows[i] as DomTableRowElement;
        const nextRow = rows[i + 1] as DomTableRowElement;
        if (shouldMergeRow(nextRow) && containsChinese(nextRow.innerHTML) && !containsChinese(thisRow.innerHTML)) {
          translationRows.push(nextRow);
          mergeRows(thisRow, nextRow);
        }
      }
      translationRows.forEach(row => row.remove());
    });
  }

  function mergeRows(originRow: DomTableRowElement, translationRow: DomTableRowElement): void {
    if (originRow.cells.length !== translationRow.cells.length) {
      return;
    }
    for (let i = 0; i < originRow.cells.length; ++i) {
      const originCell = originRow.cells[i];
      const translationCell = translationRow.cells[i];
      if (originCell.innerHTML !== translationCell.innerHTML) {
        originCell.innerHTML = `<p>${originCell.innerHTML}</p><p>${translationCell.innerHTML}</p>`;
      }
    }
  }
}
