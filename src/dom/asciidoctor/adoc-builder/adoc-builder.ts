import { Asciidoctor } from '@asciidoctor/core';
import { createAsciidoctor } from '../utils/create-asciidoctor';
import { Adoc } from '../utils/adoc';
import Document = Asciidoctor.Document;

export class AdocBuilder {
  parse(content: string): Document {
    const adoc = createAsciidoctor();
    Adoc.disableSubstitution(adoc);
    try {
      return adoc.load(this.preprocess(content), { backend: 'adoc' });
    } finally {
      Adoc.enableSubstitution(adoc);
    }
  }

  build(dom: Document): string {
    const text = this.postprocess(dom.convert());
    return text.trim();
  }

  protected preprocess(content: string): string {
    return content
      .replace(/^\[(.*)indent=("?)(\d+)("?)(.*)]$/gm, '[$1rawIndent=$2$3$4$5]')
      .replace(/^((?:ifdef|ifndef|ifeval|endif)::\[.*])$/gm, '`begin-directive:[$1]end-directive`')
      .replace(/^(include::.*?])$/gm, '`begin-directive:[$1]end-directive`')
      .replace(/^(\/\/ *(?:tag|end)::.*?])$/gm, '`begin-directive:[$1]end-directive`')
      ;
  }

  protected postprocess(content: string): string {
    return content
      .replace(/^\[(.*)rawIndent=("?)(\d+)("?)(.*)]$/gm, '[$1indent=$2$3$4$5]')
      .replace(/^`begin-directive:\[(.*?)]end-directive`$/gm, '$1')
      .replace(/^Unresolved directive in .* - (.*)$/gm, '$1');
  }
}
