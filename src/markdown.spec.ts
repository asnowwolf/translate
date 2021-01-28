import { markdown } from './markdown';
import { FakeTranslationEngine } from './engine';
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

  it('translate complex markdown', async () => {
    const original = `---
title: abc
---

# Head 1

Test

1. a
1. b
   1. b1
   1. b2
   1. b3

- a1
  - b
  - c

> a

> b
>> c

>> d

| a | a |
|----|----|
| b | b |
| c | c |

<code-example src="/abc"></code-example>a<live-example src="/def">abc</live-example>c
`;
    const engine = new FakeTranslationEngine();
    engine.batchSize = 10;
    const md = await markdown.translate(original, engine);
    expect(md).toEqual(`---
title$$origin: abc
title: '[译]abc'

---

# Head 1

# 译Head 1


Test

译Test


1. a

   译a

1. b

   译b


   1. b1

      译b1

   1. b2

      译b2

   1. b3

      译b3


- a1

  译a1


  - b

    译b

  - c

    译c


> a
>
> 译a
>
>
> b
>
> 译b
>
>
> > c
> >
> > 译c
> >
>
> > d
> >
> > 译d
> >

| a | a |
| --- | --- |
| 译a | 译a |
| b | b |
| 译b | 译b |
| c | c |
| 译c | 译c |

<code-example src="/abc"></code-example>a<live-example src="/def">abc</live-example>c

译<code-example src="/abc"></code-example>a<live-example src="/def">abc</live-example>c

`);
  });
});
