import { readFileSync, writeFileSync } from 'fs';
import {
  defaultSelectors,
  DomDocument,
  DomDocumentFragment,
  DomElement,
  DomParentNode,
  DomSelector,
  DomTableElement,
  DomTableRowElement,
} from '../dom/parse5/dom-models';
import { containsChinese } from '../dom/common';
import * as slugs from 'github-slugger';
import { isDeepStrictEqual } from 'util';
import { extname } from 'path';

export class Marker {
  constructor(
    private readonly selectors: ((node: DomElement) => boolean)[] = defaultSelectors,
  ) {
  }

  markFile(filename: string, mono = false): void {
    const content = readFileSync(filename, 'utf8');
    const isAngularJson = extname(filename) === '.json';
    if (isAngularJson) {
      writeFileSync(filename, this.markAngularJson(content, mono), 'utf8');
    } else {
      writeFileSync(filename, this.markHtml(content, mono), 'utf8');
    }
  }

  private markHtml(content: string, mono: boolean) {
    const doc = parseDoc(content);
    this.addIdForHeaders(doc);
    this.markAndSwapAll(doc);
    if (mono) {
      this.monochromatic(doc);
    }
    return doc.toHtml();
  }

  private markAngularJson(content: string, mono: boolean) {
    const json = JSON.parse(content);
    if (!json.contents) {
      return content;
    }

    json.contents = this.markHtml(this.preprocessAngularJson(json.contents), mono);
    return JSON.stringify(json);
  }

  addIdForHeaders(body: DomParentNode): void {
    const headers = body.querySelectorAll<DomElement>(it => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(it.nodeName));
    const slugger = slugs();
    headers.forEach(header => {
      if (!header.hasAttribute('id')) {
        header.setAttribute('id', toId(slugger, header.textContent));
      }
    });
  }

  markAndSwapAll(body: DomParentNode): void {
    restructureTable(body);
    this.selectors.forEach(selector => markAndSwap(body, selector));
  }

  monochromatic(parent: DomParentNode): void {
    parent.querySelectorAll(it => it.hasAttribute('translation-origin')).forEach(it => it.remove());
    parent.querySelectorAll(it => it.hasAttribute('translation-result')).forEach(it => it.removeAttribute('translation-result'));
  }

  private preprocessAngularJson(contents: string): string {
    // 对 cheatsheet页做特殊处理
    if (contents.includes('<h1 class="no-toc">Cheat Sheet</h1>')) {
      return contents.replace(/<(td|th)>\s*<p>([\s\S]*?)<\/p>\s*<\/\1>/g, '<$1>$2</$1>');
    }
    // 为其它页面中的 section、header 添加翻译标记
    return contents.replace(/<(section|header)\b/g, '<$1 ng-should-translate');
  }
}

function parseDoc(content: string): DomDocument | DomDocumentFragment {
  if (content.includes('<html')) {
    return DomDocument.parse(content);
  } else {
    return DomDocumentFragment.parse(content);
  }
}

function toId(slugger, text) {
  return slugger.slug(text);
}

function isPaired(prev: DomElement, element: DomElement): boolean {
  return prev && prev.nextElementSibling === element &&
    prev.isTagOf(element.tagName) && prev.className === element.className;
}

export function markAndSwap(element: DomParentNode, selector: DomSelector): void {
  const elements = element.querySelectorAll(selector);
  elements.forEach(element => {
    if (containsChinese(element.innerHTML) && !element.hasAttribute('no-translate') && element.getAttribute('translate') !== 'no') {
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
    if (isDeepStrictEqual(originCell.attrs, translationCell.attrs) && originCell.innerHTML !== translationCell.innerHTML) {
      originCell.innerHTML = `<nt-wrapper>${originCell.innerHTML}</nt-wrapper><nt-wrapper>${translationCell.innerHTML}</nt-wrapper>`;
    }
  }
}
