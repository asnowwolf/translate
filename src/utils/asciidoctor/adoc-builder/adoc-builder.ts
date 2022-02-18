import * as asciidoctor from 'asciidoctor.js';
import { RawIncludeProcessor } from './processors/raw-include.processor';
import { AdocConverter } from './renderers/adoc-converter';
import { DocumentNode } from './dom/document-node';

export class AdocBuilder {
  parse(content: string): DocumentNode {
    // 每次都重新初始化，以免相互干扰。
    const adoc = asciidoctor();
    const consts = adoc.$$const.Substitutors.$$const;
    // 不要对任何部分进行编码，因为我们的输出不是 html，而是 adoc。
    consts.BASIC_SUBS = [];
    consts.HEADER_SUBS = [];
    consts.NORMAL_SUBS = [];
    consts.TITLE_SUBS = [];
    consts.REFTEXT_SUBS = [];
    consts.VERBATIM_SUBS = ['callouts'];
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
