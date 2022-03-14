import { DomDocumentFragment, DomElement, DomNode, DomText } from '../../parse5/dom-models';
import { quoteTagToChar } from './quotes';

function nodeToAdoc(dom: DomNode): string {
  if (dom instanceof DomText) {
    return dom.textContent;
  }
  if (dom instanceof DomElement) {
    const content = dom.childNodes.map(it => nodeToAdoc(it)).join('');
    const quoteChar = quoteTagToChar(dom);
    if (quoteChar) {
      return [quoteChar, content, quoteChar].join('');
    }
  }
}

export function htmlToAdoc(html: string): string {
  const dom = DomDocumentFragment.parse(html).querySelector(it => it.isTagOf('p') && it.getAttribute('adoc-name') === 'paragraph');
  dom.mergeTextNodes();
  return nodeToAdoc(dom);
}
