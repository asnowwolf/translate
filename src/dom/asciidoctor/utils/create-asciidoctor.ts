import asciidoctor, { Asciidoctor } from '@asciidoctor/core';
import { AdocConverter } from '../adoc-builder/renderers/adoc-converter';

export function createAsciidoctor(): Asciidoctor {
  const result = asciidoctor();
  result.ConverterFactory.register(new AdocConverter(), ['adoc']);
  return result;
}
