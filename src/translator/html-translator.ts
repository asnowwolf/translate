import { Translator } from './translator';
import { defaultSelectors, DomChildNode, DomDocument, DomElement, DomNode, DomText } from '../tiny-dom/dom-models';
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
    doc.title = titles[0]?.trim() ?? '';

    if (!doc.body) {
      return doc;
    }

    this.addWrapperForLi(doc.body);

    const elements = this.selectors
      .map(selector => Array.from(doc.querySelectorAll(selector)))
      .flat().filter(node => !node.previousElementSibling?.hasAttribute('translation-result'));

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
      origin.parentNode?.insertBefore(resultNode, origin);
      if (!spaces.trim()) {
        const node = new DomText(spaces);
        origin.parentNode?.insertBefore(node, origin);
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

  private addWrapperForLi(body: DomElement) {
    const li = body.querySelectorAll((it) => it.isTagOf('li', 'td', 'th'));
    li.forEach(it => {
      it.childNodes = wrapChildren(it);
      it.childNodes.forEach(child => {
        child.parentNode = it;
      });
    });
  }
}

function getSpacingNode(node: DomChildNode, defaultText: string): DomChildNode {
  if (isInlineNode(node) && isBlank(node)) {
    node.remove();
    return node;
  } else {
    return new DomText(defaultText);
  }
}

function addToResult(wrapper: DomElement, result: DomChildNode[], leadingSpaces: string) {
  if (wrapper.childNodes.length) {
    if (isBlank(wrapper)) {
      result.push(...wrapper.childNodes);
    } else {
      const leadingNode = getSpacingNode(wrapper.firstChild, `${leadingSpaces}  `);
      const tailingNode = getSpacingNode(wrapper.lastChild, `${leadingSpaces}`);
      result.push(leadingNode);
      result.push(wrapper);
      result.push(tailingNode);
    }
  }
}

function wrapChildren(node: DomElement): DomChildNode[] {
  let wrapper: DomElement = new DomElement('p');
  const result: DomChildNode[] = [];

  const leadingSpaces = node.previousSibling()?.textContent || '';
  node.childNodes.forEach((value, index) => {
    // 如果是内联，则收集内联节点
    if (isInlineNode(value)) {
      wrapper.appendChild(value);
    } else {
      // 如果是块，则输出已收集了内联节点的包装，并创建新的包装
      addToResult(wrapper, result, leadingSpaces);
      wrapper = new DomElement('p');
      wrapper.parentNode = node;
      result.push(value);
    }
  });
  addToResult(wrapper, result, leadingSpaces);
  return result;
}

function shouldIgnore(element: DomElement): boolean {
  return !!element.querySelector(it => it.hasAttribute('translation-result')) || containsChinese(element.textContent!);
}

function isInlineNode(value: DomChildNode): boolean {
  return value instanceof DomText || (value instanceof DomElement && value.isTagOf('a', 'em', 'strong', 'span', 'sub', 'sup', 'del', 'code', 'img', 'input', 'br', 'kbd', 'label', 'u', 'i', 'b', 'big', 'small', 'ins', 'strike'));
}

function isBlank(node: DomNode): boolean {
  return !node.textContent?.trim();
}
