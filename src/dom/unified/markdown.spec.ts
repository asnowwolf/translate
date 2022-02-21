import { htmlToMd, markdownFromHtml, markdownParse, markdownStringify, markdownToHtml, mdToHtml } from './markdown';

describe('markdown', () => {
  it('markdown to html', () => {
    expect(markdownToHtml(markdownParse(`# h1`))).toEqual(`<h1>h1</h1>
`);
  });
  it('html to markdown', () => {
    expect(markdownStringify(markdownFromHtml(`<h1>H1</h1>`))).toEqual('# H1\n');
  });

  it('markdown code to html', () => {
    expect(markdownToHtml(markdownParse('```\nvar a = 1;\nvar b = 2;\n```\n'))).toEqual(`<pre><code>var a = 1;
var b = 2;
</code></pre>
`);
  });

  it('html code to markdown', () => {
    expect(markdownStringify(markdownFromHtml(`<pre>
<code>
var a = 1;
var b = 2;
</code>
</pre>
`))).toEqual(`\`\`\`
var a = 1;
var b = 2;
\`\`\`
`);
  });

  it('markdown custom tag to html', () => {
    expect(markdownToHtml(markdownParse(`<t>a</t>`))).toEqual(`<p><t>a</t></p>
`);
  });

  it('html custom tag to markdown', () => {
    expect(markdownStringify(markdownFromHtml(`<t>a</t>`))).toEqual('a\n');
  });

  it('markdown escaped text to html', () => {
    expect(markdownToHtml(markdownParse(`&#8220;中文&mdash;&#8221;`))).toEqual(`<p>“中文—”</p>\n`);
  });

  it('html escaped text to markdown', () => {
    expect(markdownStringify(markdownFromHtml(`<p>&#8220;中文&mdash;&#8221;</p>`))).toEqual('“中文—”\n');
  });

  it('yaml', () => {
    const tree = markdownParse(`---
title: abc
---
# Head 1`);
    const text = markdownStringify(tree);
    expect(text).toEqual(`---
title: abc
---

# Head 1
`);
  });
  it('markdown to html to markdown', () => {
    const sample = `# h1

_a_ __a__ ***a***

11. a
12. b

<code-example language="html">
  &lt;nav [style.background-color]="expression"&gt;&lt;/nav&gt;

  &lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;
</code-example>

{@a top}

[a][1][b](2)

* a
* b

## h2

* a
* b
`;
    const html = mdToHtml(sample);
    expect(htmlToMd(html)).toEqual(sample);
  });
  it('parse markdown with <code-example>...</code-example>', () => {
    const markdown = `a

  <code-example>
    123
    3344
  </code-example>

b`;
    const tree = markdownParse(markdown);
    expect(markdownStringify(tree).trim()).toEqual(markdown.trim());
  });

  it('support reference links', () => {
    const markdown = `# section 1

[one][1]

# section 2

[1]: http://www.1.com`;
    const tree = markdownParse(markdown);
    expect(markdownStringify(tree).trim()).toEqual(markdown);
  });

  it('should rebuild markdown exactly', () => {
    const markdown = `*a*_b_`;
    const tree = markdownParse(markdown);
    expect(markdownStringify(tree).trim()).toEqual(markdown);
  });

  it('should parse originalId', () => {
    const markdown = `# h1 {@originalId 123}`;
    const tree = markdownParse(markdown);
    expect(markdownStringify(tree).trim()).toEqual(markdown);
  });

  it('when mdToHtml, originalId should mark with translate="no"', () => {
    const markdown = `# h1 {@originalId 123}`;
    const html = '<h1>h1<original-id translate="no" value="123"></original-id></h1>';
    expect(mdToHtml(markdown).trim()).toEqual(html);
    expect(htmlToMd(html).trim()).toEqual(markdown);
  });
});
