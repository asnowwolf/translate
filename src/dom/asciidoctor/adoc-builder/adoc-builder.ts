import { Asciidoctor } from '@asciidoctor/core';
import { createAsciidoctor } from '../utils/create-asciidoctor';
import { Adoc } from '../utils/adoc';
import Document = Asciidoctor.Document;

export class AdocBuilder {
  parse(content: string): Document {
    const adoc = createAsciidoctor();
    Adoc.setSubstitutionsForAdoc(adoc);
    try {
      return adoc.load(Adoc.escapeDirectives(content), { backend: 'adoc' });
    } finally {
      Adoc.setSubstitutionsForDefaultHtml(adoc);
    }
  }

  build(doc: Document): string {
    const text = Adoc.unescapeDirectives(doc.convert());
    return text.trim();
  }
}
