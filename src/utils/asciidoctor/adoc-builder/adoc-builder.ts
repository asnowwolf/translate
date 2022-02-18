import * as asciidoctor from 'asciidoctor.js';
import { RawIncludeProcessor } from './processors/raw-include.processor';
import { AdocConverter } from './renderers/adoc-converter';
import { DocumentNode } from './dom/document-node';

export class AdocBuilder {
  parse(content: string): DocumentNode {
    // 每次都重新初始化，以免相互干扰。
    const adoc = asciidoctor();
    const registry = adoc.Extensions.create();
    registry.includeProcessor(RawIncludeProcessor);
    adoc.ConverterFactory.register(new AdocConverter(), ['adoc']);
    return adoc.load(content, { extension_registry: registry, backend: 'adoc' });
  }

  build(dom: DocumentNode): string {
    const text = dom.convert();
    return text.trim();
  }
}
