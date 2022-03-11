import { createAsciidoctor } from '../../utils/create-asciidoctor';

describe('tiny html converter', () => {
  it('simple', () => {
    const adoc = createAsciidoctor();
    const html = adoc.convert(`= Title

== Section

_p\`a\`r**agr**aph_

#pa^ra^gr~ap~h#
`, {
      backend: 'tiny-html',
    });
    expect(html).toEqual(`<!DOCTYPE html><html><head><title>Title</title></head><body><section title="Section"><p>par<strong>agr</strong>aph</p></section></body></html>`);
  });
});
