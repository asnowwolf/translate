import { TranslationEngine } from './translation-engine';
import { delay } from '../dom/delay';
import { DomDocumentFragment, DomElement, DomNode, DomParentNode, DomText } from '../dom/parse5/dom-models';
import { simpleEmailPattern, urlSchemaPattern } from './url-patterns';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { TranslationPair } from '../translator/translation-pair';

function isTranslatableText(text: string): boolean {
  return /[A-Za-z]/.test(text) && text !== 'no-translate' && !/^[A-Z]+$/.test(text);
}

function translateText(text: string): string {
  if (!isTranslatableText(text)) {
    return text;
  }
  if (text.startsWith('[') && text.endsWith(']')) {
    const content = text.substring(1, text.length - 1);
    return `[译${content}]`;
  } else {
    return `译${text}`;
  }
}

function translate(node: DomNode): void {
  if (node instanceof DomText) {
    // 网址和邮件地址不翻译
    if (simpleEmailPattern.test(node.value) || urlSchemaPattern.test(node.value)) {
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

function mergeTextNodes(parent: DomParentNode): void {
  let text = '';
  for (let i = parent.childNodes.length - 1; i >= 0; i--) {
    const node = parent.childNodes[i];
    if (node instanceof DomText) {
      text = node.value + text;
      const previousSibling = node.previousSibling();
      if (!(previousSibling instanceof DomText) || previousSibling instanceof DomText && /\n+/.test(previousSibling.textContent)) {
        node.value = text;
        text = '';
      } else {
        node.remove();
      }
    }

    if (node instanceof DomParentNode) {
      mergeTextNodes(node);
    }
  }
}

export class FakeTranslationEngine extends TranslationEngine {
  protected async batchTranslate(pairs: TranslationPair[], format: SentenceFormat): Promise<TranslationPair[]> {
    await delay(200);
    for (let pair of pairs) {
      const html = SentenceFormatter.toHtml(pair[0], format);
      const doc = DomDocumentFragment.parse(html);
      mergeTextNodes(doc);
      translate(doc);
      pair[1] = SentenceFormatter.fromHtml(doc.toHtml(), format);
    }
    return pairs;
  }
}
