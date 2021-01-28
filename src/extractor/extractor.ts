import { DomElement, DomParentNode } from '../tiny-dom/dom-models';
import { parse } from 'parse5';
import { readFileSync } from 'fs';
import { treeAdapter } from '../tiny-dom/dom-tree-adapter';
import { DictEntryModel } from '../dict/dict-entry.model';
import { containsChinese } from '../common';

export interface SentencePair {
  english: DomElement;
  chinese: DomElement;
}

function clearAiraHidden(body: DomParentNode): void {
  const hiddens = body.querySelectorAll<DomElement>(it => it.hasAttribute('aria-hidden'));
  hiddens.forEach(element => element.remove());
}

export function extractAll(body: DomParentNode): SentencePair[] {
  clearAiraHidden(body);
  const resultElements = body.querySelectorAll(it => it.previousElementSibling?.hasAttribute('translation-result') && it.hasAttribute('translation-origin'));
  const results: SentencePair[] = [];
  resultElements.forEach(origin => {
    const result = origin.previousElementSibling!;
    if (!containsChinese(origin.textContent!)) {
      results.push({ english: origin, chinese: result });
    }
  });
  return results;
}

export class Extractor {
  extractFile(filename: string): DictEntryModel[] {
    const content = readFileSync(filename, 'utf8');
    return this.extract(content, filename);
  }

  extract(content: string, filename: string): DictEntryModel[] {
    const doc = parse(content, { treeAdapter });
    const pairs = extractAll(doc);
    return pairs.map(pair => ({
      file: filename,
      xpath: getPathsTo(pair.english).join('/'),
      english: textOf(pair.english),
      chinese: textOf(pair.chinese),
    }));
  }
}

export function getPathsTo(element: DomParentNode): string[] {
  if (!element || element instanceof DomElement && element.isTagOf('body')) {
    return [];
  }
  return [...getPathsTo(element.parentElement), element.nodeName, element.indexOfElement.toString(10)];
}

function textOf(node: DomElement): string {
  return (node.innerHTML).trim().replace(/\s+/g, ' ');
}
