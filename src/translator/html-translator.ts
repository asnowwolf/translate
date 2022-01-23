import { Translator } from './translator';
import { defaultSelectors, DomDocument, DomElement, DomText } from '../tiny-dom/dom-models';
import { containsChinese } from '../common';
import { htmlToMd, mdToHtml } from '../markdown';
import { NoopTranslationEngine } from '../translation-engine/noop-engine';
import { sameExceptWhitespace } from './same-except-whitespace';

export class HtmlTranslator extends Translator {
  private selectors = defaultSelectors;

  async translate(text: string): Promise<string> {
    const doc = DomDocument.parse(text);
    const result = await this.translateDoc(doc);
    return result.toHtml();
  }

  async translateDoc(doc: DomDocument): Promise<DomDocument> {
    const titles = await this.engine.translate([doc.title]);
    doc.title = titles[0];

    const elements = this.selectors
      .map(selector => Array.from(doc.querySelectorAll(selector)))
      .flat();

    const originals = elements.map(it => htmlToMd(it.innerHTML));
    const translations = await this.engine.translate(originals);

    translations.forEach((translation, index) => {
      const html = mdToHtml(translation);
      this.applyTranslation(elements[index], html);
    });
    return doc;
  }

  applyTranslation(element: DomElement, translation: string): void {
    if (shouldIgnore(element)) {
      return;
    }
    if (!(this.engine instanceof NoopTranslationEngine) && !sameExceptWhitespace(element.innerHTML, translation)) {
      const resultNode = new DomElement(element.tagName);
      resultNode.innerHTML = translation;
      element.parentNode.insertBefore(resultNode, element);
      const node = new DomText('\n');
      element.parentNode.insertBefore(node, element);
      // 交换 id
      const id = element.getAttribute('id');
      if (id) {
        resultNode.setAttribute('id', id);
        element.removeAttribute('id');
      }
      resultNode.setAttribute('translation-result', 'on');
    }
    element.setAttribute('translation-origin', 'off');
  }
}

function shouldIgnore(element: DomElement): boolean {
  return !!element.querySelector(it => it.hasAttribute('translation-result')) || containsChinese(element.textContent!);
}
