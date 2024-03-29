import { SentenceFormat } from '../translator/sentence-format';
import { DomDocumentFragment } from '../dom/parse5/dom-models';
import { markdown } from '../dom/unified/markdown';
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
        return markdown.mdToHtml(sentence);
      case 'asciidoctor':
        return adocToTinyHtml(sentence);
    }
  }

  static toMarkdown(sentence: string, format: SentenceFormat): string {
    switch (format) {
      case 'html':
        return markdown.mdFromHtml(sentence);
      case 'plain':
        return markdown.mdFromHtml(SentenceFormatter.toHtml(sentence, format));
      case 'markdown':
        return sentence;
      case 'asciidoctor':
        return markdown.mdFromHtml(adocToTinyHtml(sentence));
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
        return markdown.mdFromHtml(sentence);
      case 'asciidoctor':
        return tinyHtmlToAdoc(sentence);
    }
  }

  static fromMarkdown(sentence: string, format: SentenceFormat): string {
    switch (format) {
      case 'html':
        return markdown.toHtml(sentence);
      case 'plain':
        return SentenceFormatter.toPlain(sentence, format);
      case 'markdown':
        return sentence;
      case 'asciidoctor':
        return tinyHtmlToAdoc(markdown.mdFromHtml(sentence));
    }
  }

  static toPlain(sentence: string, format: SentenceFormat): string {
    return this.fromHtml(this.toHtml(sentence, format), 'plain').trim();
  }
}
