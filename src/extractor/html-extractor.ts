import { AbstractExtractor, SentencePair } from './extractor';
import { DomDocument, DomElement, DomParentNode } from '../dom/parse5/dom-models';
import { containsChinese } from '../dom/common';
import { markdown } from '../dom/unified/markdown';

export class HtmlExtractor extends AbstractExtractor {
  extractSentencePairsFromContent(html: string): SentencePair[] {
    if (!html) {
      return [];
    }
    const doc = DomDocument.parse(html);
    clearAiraHidden(doc);
    const resultElements = doc.querySelectorAll(it => it.nextElementSibling?.hasAttribute('translation-result') && it.hasAttribute('translation-origin'));
    const results: SentencePair[] = [];
    resultElements.forEach(origin => {
      const result = origin.nextElementSibling!;
      if (!containsChinese(origin.textContent!)) {
        origin.removeAttribute('translation-origin');
        result.removeAttribute('translation-result');
        results.push({
          english: markdown.mdFromHtml(origin.innerHTML),
          chinese: markdown.mdFromHtml(result.innerHTML),
          format: 'markdown',
        });
      }
    });
    return results;
  }
}

function clearAiraHidden(body: DomParentNode): void {
  const hiddens = body.querySelectorAll<DomElement>(it => it.hasAttribute('aria-hidden'));
  hiddens.forEach(element => element.remove());
}
