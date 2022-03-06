import { AdocConverter } from './renderers/adoc-converter';
import { Asciidoctor } from '@asciidoctor/core';
import { createAsciidoctor } from '../utils/create-asciidoctor';
import Document = Asciidoctor.Document;

export function configForAdocOutput(adoc: Asciidoctor) {
  // 每次都重新初始化，以免相互干扰。
  const consts = (adoc.$$const).Substitutors.$$const;
  // 不要对任何部分进行编码，因为我们的输出不是 html，而是 adoc。
  consts.BASIC_SUBS = [];
  consts.HEADER_SUBS = [];
  consts.NORMAL_SUBS = [];
  consts.REFTEXT_SUBS = [];
  consts.VERBATIM_SUBS = ['callouts'];
  adoc.ConverterFactory.register(new AdocConverter(), ['adoc']);
}

export class AdocBuilder {
  parse(content: string): Document {
    const adoc = createAsciidoctor('adoc');
    return adoc.load(this.preprocess(content), { backend: 'adoc' });
  }

  build(dom: Document): string {
    const text = this.postprocess(dom.convert());
    return text.trim();
  }

  protected preprocess(content: string): string {
    return content
      .replace(/^\[(.*)indent=("?)(\d+)("?)(.*)]$/gm, '[$1rawIndent=$2$3$4$5]')
      .replace(/^(ifdef|ifndef|ifeval|endif)/gm, '\\$1')
      .replace(/^include::(.*?)]$/gm, '\\include::$1]');
  }

  protected postprocess(content: string): string {
    return content
      .replace(/^\[(.*)rawIndent=("?)(\d+)("?)(.*)]$/gm, '[$1indent=$2$3$4$5]')
      .replace(/^\\(ifdef|ifndef|ifeval|endif)/gm, '$1')
      .replace(/^\\include::(.*?)]/gm, 'include::$1]')
      .replace(/^Unresolved directive in .* - (.*)$/gm, '$1');
  }
}
