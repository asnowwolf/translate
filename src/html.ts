export const defaultElements = ['p,h1,h2,h3,h4,h5,h6,header', 't,span,a'];

export function markAndSwapAll(body: HTMLElement, selectorGroups: string[] = defaultElements): void {
  restructureTable(body);
  selectorGroups.forEach(selectors => mark(body, selectors));
  swap(body);
}

export function mark(node: ParentNode, selector: string): void {
  const elements = node.querySelectorAll(selector);
  elements.forEach(node => {
    if (containsChinese(node.textContent!)) {
      const prev = node.previousElementSibling;
      if (prev && prev.tagName === node.tagName && !containsChinese(prev.textContent!)) {
        node.setAttribute('translation-result', 'on');
        prev.setAttribute('translation-origin', 'off');
        // 交换 id，中文内容应该占用原文的 id
        const id = prev.getAttribute('id');
        if (id) {
          prev.removeAttribute('id');
          node.setAttribute('id', id);
        }
        const href = prev.getAttribute('href');
        if (href) {
          node.setAttribute('href', href);
        }
      }
    }
  });
}

function shouldMergeTable(element: HTMLTableElement): boolean {
  return element.getAttribute('translation-merge-rows') === 'no';
}

function shouldMergeRow(element: HTMLTableRowElement): boolean {
  if (element.getAttribute('translation-merge-rows') === 'no') {
    return false;
  }
  // 如果内部有 p 元素，则禁止自动合并
  for (let i = 0; i < element.cells.length; ++i) {
    if (element.cells.item(i)!.querySelector('p')) {
      return false;
    }
  }
  return true;
}

// 重塑表格结构
export function restructureTable(node: ParentNode): void {
  const items = node.querySelectorAll('table');
  items.forEach(table => {
    if (shouldMergeTable(table)) {
      return;
    }
    // 对出现在 thead 的行和出现在 tbody 的行进行统一处理
    const rows = table.querySelectorAll('* > tr');
    const translationRows: HTMLElement[] = [];
    for (let i = 0; i < rows.length - 1; ++i) {
      const thisRow = rows.item(i) as HTMLTableRowElement;
      const nextRow = rows.item(i + 1) as HTMLTableRowElement;
      if (shouldMergeRow(nextRow) && containsChinese(nextRow.textContent!!) && !containsChinese(thisRow.textContent!!)) {
        translationRows.push(nextRow);
        mergeRows(thisRow, nextRow);
      }
    }
    translationRows.forEach(row => row.remove());
  });
}

function mergeRows(originRow: HTMLTableRowElement, translationRow: HTMLTableRowElement): void {
  if (originRow.cells.length !== translationRow.cells.length) {
    console.warn('Origin row must have same cells count with translation row!');
    return;
  }
  const document = originRow.ownerDocument!;
  for (let i = 0; i < originRow.cells.length; ++i) {
    const originCell = originRow.cells.item(i)!;
    const translationCell = translationRow.cells.item(i)!;
    const originP = document.createElement('p');
    for (let j = 0; j < originCell.childNodes.length; ++j) {
      originP.append(originCell.childNodes.item(j)!);
    }
    const translationP = document.createElement('p');
    for (let j = 0; j < translationCell.childNodes.length; ++j) {
      translationP.append(translationCell.childNodes.item(j)!);
    }
    originCell.appendChild(originP);
    originCell.appendChild(translationP);
  }
}

export function swap(node: ParentNode): void {
  const pairList = node.querySelectorAll('[translation-origin]+[translation-result]');
  pairList.forEach(node => {
    const prev = node.previousElementSibling;
    node.parentElement!.insertBefore(node, prev);
  });
}

function containsChinese(text: string): boolean {
  return text.search(/[\u4e00-\u9fa5]/gm) !== -1;
}

