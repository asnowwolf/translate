import { html } from '../dom/parse5/html';
import { containsChinese } from '../dom/common';
import { uniqBy } from 'lodash';
import { markdown } from '../dom/unified/markdown';

export class Exporter {
  export(entries: { english: string, chinese: string }[]): { english: string, chinese: string }[] {
    return uniqBy(entries
      .map(it => {
        return { english: mdToText(it.english), chinese: mdToText(it.chinese) };
      })
      .filter(it => containsChinese(it.chinese)), it => `${it.english}\t${it.chinese}`);
  }
}

function mdToText(md: string): string {
  if (!md) {
    return md;
  }
  return html.toText(markdown.toHtml(md))
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/^[\d.]+ */g, '')
    .replace(/​/g, '')
    .trim();
}
