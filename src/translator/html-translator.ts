import { AbstractTranslator } from './abstract-translator';
import { defaultSelectors, DomChildNode, DomDocument, DomDocumentFragment, DomElement, DomNode, DomText } from '../dom/parse5/dom-models';
import { TranslationOptions } from './translation-options';
import { buildTranslationPair, TranslationPair } from './translation-pair';
import { containsChinese } from '../dom/common';

export class HtmlTranslator extends AbstractTranslator<DomDocumentFragment | DomDocument> {
  private selectors = defaultSelectors;

  parse(text: string, options: TranslationOptions = {}): DomDocumentFragment | DomDocument {
    options.htmlFragment = options.htmlFragment ?? !text.match(/^(<!DOCTYPE html>|<html\b)/si);
    if (options.htmlFragment) {
      return DomDocumentFragment.parse(text);
    } else {
      return DomDocument.parse(text);
    }
  }

  serialize(doc: DomDocumentFragment | DomDocument): string {
    return doc.toHtml();
  }

  translateDoc(doc: DomDocumentFragment | DomDocument): DomDocumentFragment | DomDocument {
    if (doc instanceof DomDocument) {
      this.formatHtml(doc);
      const titleElement = doc.head.querySelector(it => it.tagName === 'title');
      if (titleElement) {
        const [original, translation] = buildTranslationPair(
          titleElement.getAttribute('original-title'),
          titleElement.textContent,
        );
        this.translateSentence(original, translation, 'plain').then(translation => {
          if (translation && translation !== original) {
            titleElement.setAttribute('original-title', original);
            titleElement.textContent = translation;
          }
        });
      }
    }
    this.addWrapperForTextInSpecialBlocks(doc);

    const elements = this.selectors
      .map(selector => Array.from(doc.querySelectorAll(selector)))
      .flat()
      .filter(it => this.shouldTranslate(it));

    for (let element of elements) {
      const [original, translation] = this.buildTranslationPair(element);
      this.translateSentence(original, translation, 'html').then(translation => {
        if (translation && translation !== original) {
          this.applyTranslation(element, translation);
        }
      });
    }
    return doc;
  }

  private shouldTranslate<T>(node: DomNode): boolean {
    if (!(node instanceof DomElement)) {
      return false;
    }
    if (node.hasAttribute('translation-result')) {
      return false;
    }
    if (node.getAttribute('translate') === 'no') {
      return false;
    }
    if (containsChinese(node.textContent)) {
      return false;
    }
    return true;
  }

  private formatHtml(doc: DomDocument) {
    const htmlNode = doc.childNodes.find(it => it.nodeName === 'html');
    doc.insertBefore(new DomText('\n'), htmlNode);
    htmlNode.insertBefore(new DomText('\n'), htmlNode.firstChild);
    htmlNode.insertAfter(new DomText('\n'), htmlNode.lastChild);
  }

  private buildTranslationPair(element: DomElement): TranslationPair {
    const next = element.nextElementSibling;
    if (element.hasAttribute('translation-origin')) {
      return [element.innerHTML, next?.innerHTML ?? ''];
    } else {
      return [element.innerHTML, ''];
    }
  }

  applyTranslation(original: DomElement, translation: string): void {
    const existingTranslationNode = original.nextElementSibling;
    if (existingTranslationNode?.hasAttribute('translation-result')) {
      existingTranslationNode.innerHTML = translation;
      return;
    }
    const translationNode = new DomElement(original.tagName);
    translationNode.setAttribute('translation-result', 'on');
    original.setAttribute('translation-origin', 'off');
    const spaces = original.previousSibling()?.textContent || '';
    const node = new DomText(spaces);
    original.parentNode?.insertAfter(translationNode, original);
    // 如果是空格，则在结果元素前复制一份，以便对齐
    if (!spaces.trim()) {
      original.parentNode?.insertAfter(node, original);
    }
    translationNode.innerHTML = translation;
  }

  private addWrapperForTextInSpecialBlocks(body: DomDocumentFragment | DomDocument) {
    const blocks = body.querySelectorAll((it) => it.isTagOf('li', 'td', 'th'));
    blocks.forEach(it => {
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

function isInlineNode(value: DomChildNode): boolean {
  return value instanceof DomText || (value instanceof DomElement && value.isTagOf('a', 'em', 'strong', 'span', 'sub', 'sup', 'del', 'code', 'img', 'input', 'br', 'kbd', 'label', 'u', 'i', 'b', 'big', 'small', 'ins', 'strike'));
}

function isBlank(node: DomNode): boolean {
  return !node.textContent?.trim();
}
