import { FileTranslator } from './file-translator';
import { DomDocument, DomElement } from '../models/dom-models';
import { parse } from 'parse5';
import { treeAdapter } from '../dom-tree-adapter';
import { containsChinese } from '../common';
import { html } from '../html';
import defaultSelectors = html.defaultSelectors;

export class HtmlTranslator extends FileTranslator {
  private selectors = defaultSelectors;

  async translate(text: string): Promise<string> {
    const doc = parse(text, { treeAdapter });
    const result = await this.translateDoc(doc);
    return result.toHtml();
  }

  async translateDoc(doc: DomDocument): Promise<DomDocument> {
    const titles = await this.engine.translate([doc.title]);
    doc.title = titles[0];

    const elements = this.selectors
      .map(selector => Array.from(doc.querySelectorAll(selector)))
      .flat();

    for (const element of elements) {
      await this.translateElement(element);
    }

    return doc;
  }

  private async translateElement(element: DomElement): Promise<string> {
    if (shouldIgnore(element)) {
      return element.innerHTML;
    }
    const translations = await this.engine.translate([element.innerHTML]);
    const resultNode = new DomElement(element.tagName);
    resultNode.innerHTML = translations[0];
    element.parentNode.insertBefore(resultNode, element);
    // 交换 id
    const id = element.getAttribute('id');
    if (id) {
      resultNode.setAttribute('id', id);
      element.removeAttribute('id');
    }
    resultNode.setAttribute('translation-result', 'on');
    element.setAttribute('translation-origin', 'off');
  }
}

function shouldIgnore(element: DomElement): boolean {
  return !!element.querySelector(it => it.hasAttribute('translation-result')) || containsChinese(element.textContent!);
}
