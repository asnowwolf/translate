import { createAsciidoctor } from '../utils/create-asciidoctor';
import { Asciidoctor } from '@asciidoctor/core';
import { adoc } from '../utils/adoc';
import ProcessorOptions = Asciidoctor.ProcessorOptions;

export function adocToTinyHtml(content: string, options?: ProcessorOptions): string {
  const doc = createAsciidoctor();
  adoc.setSubstitutionsForTranslatableHtml(doc);
  try {
    const html = doc.convert(content, {
      ...options,
      backend: 'tiny-html',
      attributes: { outfilesuffix: '.html', experimental: true },
    });
    return (html as string)
      .replace(/^<!DOCTYPE html><html><head><title><\/title><\/head><body>\n+<article>([\s\S]*?)<\/article>\n+<\/body><\/html>$/, '$1')
      .replace(/^<article>([\s\S]*?)<\/article>$/g, '$1')
      .trim();
  } finally {
    adoc.setSubstitutionsForDefaultHtml(doc);
  }
}
