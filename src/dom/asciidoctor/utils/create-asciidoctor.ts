import asciidoctor, { Asciidoctor } from '@asciidoctor/core';
import { AdocConverter } from '../adoc-builder/renderers/adoc-converter';

export function createAsciidoctor(backend: 'html5' | 'docbook5' | 'adoc'): Asciidoctor {
  const result = asciidoctor();
  // 对 adoc 输出模式进行特殊处理
  if (backend === 'adoc') {
    // 每次都重新初始化，以免相互干扰。
    const consts = result.$$const.Substitutors.$$const;
    // 不要对任何部分进行编码，因为我们的输出不是 html，而是 adoc。
    consts.BASIC_SUBS = [];
    consts.HEADER_SUBS = [];
    consts.NORMAL_SUBS = [];
    consts.REFTEXT_SUBS = [];
    consts.VERBATIM_SUBS = ['callouts'];
    result.ConverterFactory.register(new AdocConverter(), ['adoc']);
  }
  return result;
}
