import { mdToHtml } from '../dom/unified/markdown';
import { htmlToText } from '../dom/phase5/dom-utils';

export class Exporter {
  export(entries: { english: string, chinese: string }[]): { english: string, chinese: string }[] {
    return entries.map(it => {
      return { english: mdToText(it.english), chinese: mdToText(it.chinese) };
    });
  }
}

function mdToText(md: string): string {
  if (!md) {
    return md;
  }
  return htmlToText(mdToHtml(md)).replace(/\n/g, ' ').trim();
}
