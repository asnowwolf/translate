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
    return adoc.load(this.preprocess(content), { extension_registry: registry, backend: 'adoc' });
  }

  build(dom: DocumentNode): string {
    const text = this.postprocess(dom.convert());
    return text.trim();
  }

  protected preprocess(content: string): string {
    return content
      .replace(/^\[(.*)indent=("?)(\d+)("?)(.*)]$/gm, '[$1rawIndent=$2$3$4$5]');
  }

  protected postprocess(content: string): string {
    return content
      .replace(/^\[(.*)rawIndent=("?)(\d+)("?)(.*)]$/gm, '[$1indent=$2$3$4$5]')
      .replace(/^Unresolved directive in .* - (.*)$/gm, '$1');
  }
}
