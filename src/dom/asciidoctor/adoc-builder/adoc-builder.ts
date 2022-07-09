import { Asciidoctor } from '@asciidoctor/core';
import { createAsciidoctor } from '../utils/create-asciidoctor';
import { adoc } from '../utils/adoc';
import Document = Asciidoctor.Document;

export class AdocBuilder {
  parse(content: string): Document {
    const doc = createAsciidoctor();
    adoc.setSubstitutionsForAdoc(doc);
    try {
      return doc.load(adoc.escapeDirectives(content), { backend: 'adoc' });
    } finally {
      adoc.setSubstitutionsForDefaultHtml(doc);
    }
  }

  build(doc: Document): string {
    const text = adoc.unescapeDirectives(doc.convert());
    return text.trim();
  }
}
