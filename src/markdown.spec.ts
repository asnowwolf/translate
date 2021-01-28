import { markdown } from './markdown';
import mdParse = markdown.parse;

describe('markdown', () => {
  it('markdown to html', () => {
    expect(markdown.mdToHtml(mdParse(`# h1`))).toEqual(`<h1>h1</h1>
`);
  });
  it('html to markdown', () => {
    expect(markdown.stringify(markdown.htmlToMd(`<h1>H1</h1>`))).toEqual('# H1\n');
  });

  it('markdown code to html', () => {
    expect(markdown.mdToHtml(mdParse('```\nvar a = 1;\nvar b = 2;\n```\n'))).toEqual(`<pre><code>var a = 1;
var b = 2;
</code></pre>
`);
  });

  it('html code to markdown', () => {
    expect(markdown.stringify(markdown.htmlToMd(`<pre>
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
    expect(markdown.mdToHtml(mdParse(`<t>a</t>`))).toEqual(`<p><t>a</t></p>
`);
  });

  it('html custom tag to markdown', () => {
    expect(markdown.stringify(markdown.htmlToMd(`<t>a</t>`))).toEqual('a\n');
  });

  it('markdown escaped text to html', () => {
    expect(markdown.mdToHtml(mdParse(`<p>中文&mdash;</p>`))).toEqual(`<p>中文&mdash;</p>\n`);
  });

  it('html escaped text to markdown', () => {
    expect(markdown.stringify(markdown.htmlToMd(`<p>中文&mdash;</p>`))).toEqual('中文—\n');
  });

  it('yaml', () => {
    const tree = markdown.parse(`---
title: abc
---
# Head 1`);
    const text = markdown.stringify(tree);
    expect(text).toEqual(`---
title: abc
---

# Head 1
`);
  });
  it('markdown to html to markdown', () => {
    const sample = `- a
- b
`;
    const fromMdNode = mdParse(sample);
    const toMdNode = markdown.htmlToMd(markdown.mdToHtml(fromMdNode));
    expect(markdown.stringify(toMdNode)).toEqual(sample);
  });
});
