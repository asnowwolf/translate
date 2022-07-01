import { DomDocumentFragment } from './dom-models';

export class Html {
  static toText(html): string {
    const doc = DomDocumentFragment.parse(html);
    return doc.textContent;
  }
}
