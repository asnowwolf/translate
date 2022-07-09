import { DomDocumentFragment } from './dom-models';

export namespace html {
  export function toText(html): string {
    const doc = DomDocumentFragment.parse(html);
    return doc.textContent;
  }
}
