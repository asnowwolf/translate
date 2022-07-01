import { SentenceFormat } from '../translator/sentence-format';
import { DomDocumentFragment } from '../dom/parse5/dom-models';
import { Md } from '../dom/unified/md';
import { adocToTinyHtml } from '../dom/asciidoctor/html-adoc/adoc-to-tiny-html';
import { tinyHtmlToAdoc } from '../dom/asciidoctor/html-adoc/tiny-html-to-adoc';

export class SentenceFormatter {
  static toHtml(sentence: string, format: SentenceFormat): string {
    switch (format) {
      case 'html':
        return sentence;
      case 'plain':
        const doc = DomDocumentFragment.parse('');
        doc.textContent = sentence;
        return doc.toHtml();
      case 'markdown':
        return Md.mdToHtml(sentence);
      case 'asciidoctor':
        return adocToTinyHtml(sentence);
    }
  }

  static fromHtml(sentence: string, format: SentenceFormat): string {
    switch (format) {
      case 'html':
        return sentence;
      case 'plain':
        const doc = DomDocumentFragment.parse(sentence);
        return doc.textContent;
      case 'markdown':
        return Md.mdFromHtml(sentence);
      case 'asciidoctor':
        return tinyHtmlToAdoc(sentence);
    }
  }

  static toPlain(sentence: string, format: SentenceFormat): string {
    return this.fromHtml(this.toHtml(sentence, format), 'plain').trim();
  }
}
