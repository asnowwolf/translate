import asciidoctor, { Asciidoctor } from '@asciidoctor/core';
import { AdocConverter } from '../adoc-builder/renderers/adoc-converter';
import { TinyHtmlConverter } from '../html-adoc/tiny-html-converter/tiny-html-converter';

export function createAsciidoctor(): Asciidoctor {
  const result = asciidoctor();
  result.ConverterFactory.register(new AdocConverter(), ['adoc']);
  result.ConverterFactory.register(new TinyHtmlConverter(), ['tiny-html']);
  return result;
}
