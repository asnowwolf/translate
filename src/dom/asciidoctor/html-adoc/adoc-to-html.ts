import { createAsciidoctor } from '../utils/create-asciidoctor';
import { Asciidoctor } from '@asciidoctor/core';
import ProcessorOptions = Asciidoctor.ProcessorOptions;

export function adocToHtml(adoc: string, options?: ProcessorOptions): string {
  const html = createAsciidoctor().convert(adoc, { ...options, attributes: { experimental: true } }) as string;
  return html.replace(/^<div class="paragraph">\s*(.*)\s*<\/div>$/gs, '$1').replace(/(<span class="icon"><a class="image")/g, '$1 translate="no"').trim();
}
