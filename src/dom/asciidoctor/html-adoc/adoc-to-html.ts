import { createAsciidoctor } from '../utils/create-asciidoctor';

export function adocToHtml(adoc: string): string {
  const html = createAsciidoctor().convert(adoc) as string;
  return html.replace(/^<div class="paragraph">\s*(.*)\s*<\/div>$/gs, '$1').trim();
}
