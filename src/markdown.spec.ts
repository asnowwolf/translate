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
    expect(markdownToHtml(markdownParse(`<p>中文&mdash;</p>`))).toEqual(`<p>中文&mdash;</p>\n`);
  });

  it('html escaped text to markdown', () => {
    expect(markdownStringify(markdownFromHtml(`<p>中文&mdash;</p>`))).toEqual('中文—\n');
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

- a
- b
`;
    expect(htmlToMd(mdToHtml(sample))).toEqual(sample);
  });
});
