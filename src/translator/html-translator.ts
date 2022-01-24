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

    this.restructureTextOnlyLiToP(doc.body);

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

  applyTranslation(origin: DomElement, translation: string): void {
    if (shouldIgnore(origin)) {
      return;
    }
    if (!(this.engine instanceof NoopTranslationEngine) && !sameExceptWhitespace(origin.innerHTML, translation)) {
      const spaces = origin.previousSibling()?.textContent || '';
      const resultNode = new DomElement(origin.tagName);
      resultNode.innerHTML = translation;
      origin.parentNode.insertBefore(resultNode, origin);
      if (!spaces.trim()) {
        const node = new DomText(spaces);
        origin.parentNode.insertBefore(node, origin);
      }
      // 交换 id
      const id = origin.getAttribute('id');
      if (id) {
        resultNode.setAttribute('id', id);
        origin.removeAttribute('id');
      }
      resultNode.setAttribute('translation-result', 'on');
    }
    origin.setAttribute('translation-origin', 'off');
  }

  private restructureTextOnlyLiToP(body: DomElement) {
    const li = body.querySelectorAll((it) => it.isTagOf('li'));
    li.forEach(it => {
      it.childNodes.forEach((value, index) => {
        if (value instanceof DomText && value.textContent.trim()) {
          const leadingSpaces = value.previousSibling()?.textContent;
          const tailingSpaces = value.nextSibling()?.textContent;
          const parentLeadingSpaces = it.previousSibling()?.textContent?.replace(/^\n/, '') ?? '';
          const wrapper = new DomElement('p');
          wrapper.innerHTML = value.textContent;
          wrapper.parentNode = it;
          it.childNodes[index] = wrapper;
          if (!leadingSpaces) {
            it.insertBefore(new DomText(`\n${parentLeadingSpaces}  `), wrapper);
          }
          if (!tailingSpaces) {
            it.insertAfter(new DomText(`\n${parentLeadingSpaces}`), wrapper);
          }
        }
      });
    });
  }
}

function shouldIgnore(element: DomElement): boolean {
  return !!element.querySelector(it => it.hasAttribute('translation-result')) || containsChinese(element.textContent!);
}
