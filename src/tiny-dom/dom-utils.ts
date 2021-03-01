import { DomDocumentFragment } from './dom-models';

export function htmlToText(html: string): string {
  const dom = DomDocumentFragment.parse(html);
  return dom.textContent;
}
