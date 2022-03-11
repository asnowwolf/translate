import { adocToHtml } from './adoc-to-html';

describe('adoc-to-html', () => {
  it('plain text', () => {
    const input = `pa>ragraph`;
    expect(adocToHtml(input)).toEqual(`<p>pa&gt;ragraph</p>`);
  });
  describe('quoted', () => {
    it('Constrained strong', () => {
      const input = `*pa<ragraph*`;
      expect(adocToHtml(input)).toEqual(`<p><strong>pa&lt;ragraph</strong></p>`);
    });
    it('Unconstrained strong', () => {
      const input = `**pa&ra**graph`;
      expect(adocToHtml(input)).toEqual(`<p><strong>pa&amp;ra</strong>graph</p>`);
    });
    it('Constrained code', () => {
      const input = `_paragraph_`;
      expect(adocToHtml(input)).toEqual(`<p><em>paragraph</em></p>`);
    });
    it('Unconstrained code', () => {
      const input = `__para__graph`;
      expect(adocToHtml(input)).toEqual(`<p><em>para</em>graph</p>`);
    });
    it('Constrained code', () => {
      const input = '`paragraph`';
      expect(adocToHtml(input)).toEqual(`<p><code>paragraph</code></p>`);
    });
    it('Unconstrained code', () => {
      const input = '``para``graph';
      expect(adocToHtml(input)).toEqual(`<p><code>para</code>graph</p>`);
    });
    it('Constrained highlight', () => {
      const input = '#paragraph#';
      expect(adocToHtml(input)).toEqual(`<p><mark>paragraph</mark></p>`);
    });
    it('Unconstrained highlight', () => {
      const input = '##para##graph';
      expect(adocToHtml(input)).toEqual(`<p><mark>para</mark>graph</p>`);
    });
    it('Constrained superscript', () => {
      const input = '^paragraph^';
      expect(adocToHtml(input)).toEqual(`<p><sup>paragraph</sup></p>`);
    });
    it('Constrained subscript', () => {
      const input = '~paragraph~';
      expect(adocToHtml(input)).toEqual(`<p><sub>paragraph</sub></p>`);
    });
  });
  describe('text formats', () => {
    it('simple', () => {
      const content = `*one* _two_ \`three\` #four# ~five~ ^six^ **seven eight**`;
      const input = adocToHtml(content);
      expect(input).toEqual(`<p><strong>one</strong> <em>two</em> <code>three</code> <mark>four</mark> <sub>five</sub> <sup>six</sup> <strong>seven eight</strong></p>`);
    });

    it('mixed', () => {
      const content = '`*_one two_*` & ``*__three__*``four``*__five__*``';
      expect(adocToHtml(content)).toEqual('<p><code><strong><em>one two</em></strong></code> &amp; <code><strong><em>three</em></strong></code>four<code><strong><em>five</em></strong></code></p>');
    });

    it('literal monospace', () => {
      const content = `You can reference the value of a document attribute using
the syntax \`\`{name}\`\`, where  is the attribute name.`;
      expect(adocToHtml(content)).toEqual(`<p>You can reference the value of a document attribute using
the syntax <code>{name}</code>, where  is the attribute name.</p>`);
    });

    it('text span', () => {
      const content = `The text [.underline]#underline me# is underlined.`;
      expect(adocToHtml(content)).toEqual(`<p>The text <span class="underline">underline me</span> is underlined.</p>`);
    });
  });
  describe('inline anchor', function () {
    it('inline anchor', () => {
      const input = 'Learn how to <<link-ma>cro-attributes,use att&ributes within the link macro>>.';
      expect(adocToHtml(input)).toEqual(`<p>Learn how to <a href="#link-ma&gt;cro-attributes">use att&amp;ributes within the link macro</a>.</p>`);
    });
    it('cross references', () => {
      const input = 'Refer to <<Int&ernal Cross References>>.';
      expect(adocToHtml(input)).toEqual(`<p>Refer to <a href="#Int&amp;ernal Cross References">[Int&amp;ernal Cross References]</a>.</p>`);
    });
    it('cross document references', () => {
      const input = 'Refer to xref:docu>ment-b.adoc#section-b[Se&ction B] for more information.';
      expect(adocToHtml(input)).toEqual(`<p>Refer to <a href="docu&gt;ment-b.html#section-b">Se&amp;ction B</a> for more information.</p>`);
    });
  });
  describe('links', () => {
    it('autolinks', () => {
      const content = `One https://www.one.org.
Email to two@example.com`;
      expect(adocToHtml(content)).toEqual(`<p>One <a href="https://www.one.org" class="bare">https://www.one.org</a>.
Email to <a href="mailto:two@example.com">two@example.com</a></p>`);
    });

    it('enclosed link', () => {
      const content = `You will often see https://example.org used in examples.`;
      expect(adocToHtml(content)).toEqual(`<p>You will often see <a href="https://example.org" class="bare">https://example.org</a> used in examples.</p>`);
    });

    it('no autolink', () => {
      const content = `\\https://example.org. \\help@example.org`;
      expect(adocToHtml(content)).toEqual(`<p>https://example.org. help@example.org</p>`);
    });
    it('url macro', () => {
      const content = `Chat with other Asciidoctor users on the https://discuss.asciidoctor.org/[*mailing list*^, role=green].`;
      expect(adocToHtml(content)).toEqual(`<p>Chat with other Asciidoctor users on the <a href="https://discuss.asciidoctor.org/" class="green" target="_blank" rel="noopener"><strong>mailing list</strong></a>.</p>`);
    });

    it('complex', () => {
      const content = `:link-with-underscores: https://asciidoctor.org/now_this__link_works.html

This URL has repeating underscores {link-with-underscores}.`;
      expect(adocToHtml(content)).toEqual(`<p>This URL has repeating underscores <a href="https://asciidoctor.org/now_this__link_works.html" class="bare">https://asciidoctor.org/now_this__link_works.html</a>.</p>`);
    });
  });
  it('inline breaks', () => {
    const input = `Rubies are red, +
Topazes are blue.
`;
    expect(adocToHtml(input)).toEqual(`<p>Rubies are red,<br>
Topazes are blue.</p>`);
  });
  describe('inline macros', () => {

    it('button macro', () => {
      const content = `Press the btn:[O&K] button when you are finished.
`;
      expect(adocToHtml(':experimental:\n' + content))
        .toEqual(`<p>Press the <b class="button">O&amp;K</b> button when you are finished.</p>`);
    });
    it('menu macro', () => {
      const content = `Select menu:Vi&ew[Z&oom > Res<et > Reset 1] to reset the zoom level to the default setting.
`;
      expect(adocToHtml(':experimental:\n' + content))
        .toEqual(`<p>Select <span class="menuseq"><b class="menu">Vi&amp;ew</b>&#160;<b class="caret">&#8250;</b> <b class="submenu">Z&amp;oom</b>&#160;<b class="caret">&#8250;</b> <b class="submenu">Res&lt;et</b>&#160;<b class="caret">&#8250;</b> <b class="menuitem">Reset 1</b></span> to reset the zoom level to the default setting.</p>`);
    });
    it('keyboard macro', () => {
      const content = `kbd:[C>trl+Shift+N]
`;
      expect(adocToHtml(':experimental:\n' + content))
        .toEqual(`<p><span class="keyseq"><kbd>C&gt;trl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd></span></p>`);
    });
  });
  describe('resources', () => {
    it('images - inline', () => {
      const content = `Click image:pau>se.png[Pau>se] when you need a break.
`;
      expect(adocToHtml(content))
        .toEqual(`<p>Click <span class="image"><img src="pau&gt;se.png" alt="Pau&gt;se"></span> when you need a break.</p>`);
    });
    it('images - inline with attributes', () => {
      const content = `Click image:pa>use.png[Pa&use,200,200] when you need a break.
`;
      expect(adocToHtml(content))
        .toEqual(`<p>Click <span class="image"><img src="pa&gt;use.png" alt="Pa&amp;use" width="200" height="200"></span> when you need a break.</p>`);
    });
    it('icon with window', () => {
      const content = `icon:dow&nload[link=https://ruby<gems.org/downloads/whizbang-1.0.0.gem,window=_blank]
`;
      expect(adocToHtml(content)).toEqual(`<p><span class="icon"><a class="image" translate="no" href="https://ruby&lt;gems.org/downloads/whizbang-1.0.0.gem" target="_blank" rel="noopener">[dow&amp;nload&#93;</a></span></p>`);
    });
    it('icon without window', () => {
      const content = `icon:download[link=https://rubygems.org/downloads/whizbang-1.0.0.gem]
`;
      expect(adocToHtml(content)).toEqual(`<p><span class="icon"><a class="image" translate="no" href="https://rubygems.org/downloads/whizbang-1.0.0.gem">[download&#93;</a></span></p>`);
    });
  });
  describe('STEM formula', () => {
    it('inline', () => {
      const content = `stem:[sqrt(4) = 2]

Water (stem:[H_2O]) is a critical component.`;
      expect(adocToHtml(content)).toEqual(`<p>\\$sqrt(4) = 2\\$</p>
</div>
<div class="paragraph">
<p>Water (\\$H_2O\\$) is a critical component.</p>`);
    });
    it('block', () => {
      const content = `[stem]
++++
sqrt(4) = 2
++++`;
      expect(adocToHtml(content)).toEqual(`<div class="stemblock">
<div class="content">
\\$sqrt(4) = 2\\$
</div>
</div>`);
    });
    it('mixed', () => {
      const content = `= One
Two <two@example.org>
:stem: latexmath

[asciimath]
++++
sqrt(4) = 2
++++`;
      expect(adocToHtml(content)).toEqual(`= 一
Two <two@example.org>
:stem: latexmath

[asciimath]
++++
sqrt(4) = 2
++++`);
    });
  });

  it('footnotes', () => {
    const content = `The hail-and-rainbow protocol can be initiated at five levels:

doublefootnote:[The double hail-and-rainbow level makes my toes tingle.]

A bold statement!footnote:disclaimer[Opinions are my own.]

Another outrageous statement.footnote:disclaimer[]

Some plain paragraph.
`;
    expect(adocToHtml(content)).toEqual(`<p>The hail-and-rainbow protocol can be initiated at five levels:</p>
</div>
<div class="paragraph">
<p>double<sup class="footnote">[<a id="_footnoteref_1" class="footnote" href="#_footnotedef_1" title="View footnote.">1</a>]</sup></p>
</div>
<div class="paragraph">
<p>A bold statement!<sup class="footnote" id="_footnote_disclaimer">[<a id="_footnoteref_2" class="footnote" href="#_footnotedef_2" title="View footnote.">2</a>]</sup></p>
</div>
<div class="paragraph">
<p>Another outrageous statement.<sup class="footnoteref">[<a class="footnote" href="#_footnotedef_2" title="View footnote.">2</a>]</sup></p>
</div>
<div class="paragraph">
<p>Some plain paragraph.</p>
</div>
<div id="footnotes">
<hr>
<div class="footnote" id="_footnotedef_1">
<a href="#_footnoteref_1">1</a>. The double hail-and-rainbow level makes my toes tingle.
</div>
<div class="footnote" id="_footnotedef_2">
<a href="#_footnoteref_2">2</a>. Opinions are my own.
</div>`);
  });
});
