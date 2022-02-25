import { DomDocument, DomElement, DomParentNode } from '../dom/phase5/dom-models';
import { readFileSync } from 'fs';
import { containsChinese } from '../dom/common';
import { Dict, DictEntry } from '../dict/dict';
import { groupBy, uniqBy } from 'lodash';
import { htmlToMd } from '../dom/unified/markdown';
import { v4 } from 'uuid';

export class Extractor {
  extractFile(filename: string): DictEntry[] {
    const content = readFileSync(filename, 'utf8');
    return this.extract(content, filename);
  }

  extract(content: string, filename: string): DictEntry[] {
    const doc = DomDocument.parse(content);
    const pairs = extractAll(doc);
    return pairs.map((pair) => ({
      id: v4(),
      path: filename,
      english: htmlToMd(pair.english.outerHTML).trim(),
      chinese: htmlToMd(pair.chinese.outerHTML).trim(),
      isRegExp: false,
      confidence: 'Manual',
    }));
  }

  async extractFilesToDict(files: string[], dict: Dict, filter: RegExp = /.*/): Promise<void> {
    const allPairs = files.map(file => this.extractFile(file)).flat()
      .filter(it => filter.test(it.english) || filter.test(it.chinese));
    const pairs = uniqBy(allPairs, (it) => it.english + it.chinese);
    const groups = groupBy(pairs, it => it.path);
    for (const [file, pairs] of Object.entries(groups)) {
      for (const pair of pairs) {
        await dict.createOrUpdate(pair.english, pair.chinese, { path: file });
      }
    }
  }
}

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
