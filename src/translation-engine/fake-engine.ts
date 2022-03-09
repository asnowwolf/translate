import { TranslationEngine } from './translation-engine';
import { delay } from '../dom/delay';
import { DomChildNode, DomDocumentFragment, DomElement, DomNode, DomParentNode, DomText } from '../dom/parse5/dom-models';
import { simpleEmailPattern, urlSchemaPattern } from './url-patterns';

function isTranslatableText(text: string): boolean {
  return /[A-Za-z]/.test(text) && text !== 'no-translate' && !/^[A-Z]+$/.test(text);
}

function translateText(text: string): string {
  if (!isTranslatableText(text)) {
    return text;
  }
  return `译${text}`;
}

function isTranslatable(node: DomNode): boolean {
  return node && node instanceof DomText && isTranslatableText(node.value);
}

function shouldTranslate(node: DomChildNode): boolean {
  if (!isTranslatable(node)) {
    return false;
  }
  // 找到之前的连续文本节点
  const prevTextNodes: DomText[] = [];
  let prev = node.previousSibling();
  while (prev && prev instanceof DomText) {
    prevTextNodes.unshift(prev);
    prev = prev.previousSibling();
  }
  // 如果这些文本节点中有任何一个是可翻译的，则返回false
  return !prevTextNodes.some(it => isTranslatable(it));
}

function translate(node: DomNode): void {
  if (node instanceof DomText) {
    // 网址和邮件地址不翻译
    if (simpleEmailPattern.test(node.value) || urlSchemaPattern.test(node.value)) {
      return;
    }

    if (!shouldTranslate(node)) {
      return;
    }

    node.value = translateText(node.value);
  } else if (node instanceof DomElement && (node.isTagOf('code', 'kbd') || node.getAttribute('translate') === 'no')) {
    // 什么也不做
  } else if (node instanceof DomElement && node.isTagOf('img', 'audio', 'video')) {
    const alt = node.getAttribute('alt');
    if (alt) {
      node.setAttribute('alt', translateText(alt));
    }
  } else if (node instanceof DomParentNode) {
    node.childNodes.forEach(translate);
  }
}

export class FakeTranslationEngine extends TranslationEngine {
  protected async doTranslateHtml(texts: string[]): Promise<string[]> {
    return delay(200).then(() => Promise.all(texts.map(text => {
      const dom = DomDocumentFragment.parse(text);
      translate(dom);
      return dom.toHtml();
    })));
  }
}
