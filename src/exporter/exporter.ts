import { Html } from '../dom/parse5/html-utils';
import { containsChinese } from '../dom/common';
import { uniqBy } from 'lodash';
import { Md } from '../dom/unified/md';

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
  return Html.toText(Md.toHtml(md))
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/^[\d.]+ */g, '')
    .replace(/​/g, '')
    .trim();
}
