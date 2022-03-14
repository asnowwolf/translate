import { Adoc } from './adoc';

describe('adoc utils', function () {
  it('escapeDirectives', () => {
    expect(Adoc.escapeDirectives(`first line of child

include::grandchild-include.adoc[]

last line of child`)).toEqual(`first line of child

\`begin-directive:[include::grandchild-include.adoc[]]end-directive\`

last line of child`);
  });

  it('unescapeDirectives', () => {
    expect(Adoc.unescapeDirectives(`first line of child

\`begin-directive:[include::grandchild-include.adoc[]]end-directive\`

last line of child`)).toEqual(`first line of child

include::grandchild-include.adoc[]

last line of child`);
  });
});
