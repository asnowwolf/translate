import { Md } from './md';
import { Parent } from 'mdast';

describe('markdown', () => {
  describe('should convert to html and convert back to markdown(normalize)', () => {
    it('heading', () => {
      const md = `# h1`;
      const html = `<h1>h1</h1>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });

    it('normalize list items', () => {
      const ast = Md.parse(`
1. a
   b

   一
二

2. a
3. c

   c0

   - c1
   - c2

4. d
   - d1
   - d2
5. e
`);
      // 重建 markdown
      const normalized = `1. a
      b

   一
   二

2. a

3. c

   c0

   - c1
   - c2

4. d
   - d1
   - d2

5. e`;
      expect(Md.stringify(ast)).toEqual(normalized);
      expect(Md.stringify(Md.parse(normalized))).toEqual(normalized);
    });

    it('url', () => {
      const md = `[text](/url "title")`;
      const html = `<p><a href="/url" title="title">text</a></p>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded live-example', () => {
      const md = 'one<live-example src="abc">def</live-example>';
      const html = `<p>one<live-example src="abc">def</live-example></p>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(`<p>one<html-raw value="%3Clive-example%20src%3D%22abc%22%3Edef%3C%2Flive-example%3E"></html-raw></p>`);
    });

    it('embedded comment - inline', () => {
      const md = 'a<!--links-->b';
      const html = `<p>a<!--links-->b</p>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded comment - block', () => {
      const md = `<!--
links
-->`;
      const html = `<!--
links
-->`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded html', () => {
      const md = '<header>a</header>b';
      const html = `<p><tag value="%3Cheader%3E"></tag>a<tag value="%3C%2Fheader%3E"></tag>b</p>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
      expect(Md.mdFromHtml(html).trim()).toEqual(md);
    });

    it('embedded br and inline code', () => {
      const md = 'one<br />`<table>`';
      const html = `<p>one<tag value="%3Cbr%20%2F%3E"></tag><code>&#x3C;table></code></p>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded code-example', () => {
      const md = `<code-example language="html">

ng build --prod
cd dist
http-server -p 8080

</code-example>`;
      const html = `<html-raw value="%3Ccode-example%20language%3D%22html%22%3E%0A%0Ang%20build%20--prod%0Acd%20dist%0Ahttp-server%20-p%208080%0A%0A%3C%2Fcode-example%3E"></html-raw>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });

    it('code-example in list', () => {
      const md = `* item 1

  <code-example language="html">

  http-server -p 8080

  </code-example>

* item 2`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(`<ul>
<li nt__marker="*"><p>item 1</p><html-raw value="%3Ccode-example%20language%3D%22html%22%3E%0A%0Ahttp-server%20-p%208080%0A%0A%3C%2Fcode-example%3E"></html-raw></li>
<li nt__marker="*"><p>item 2</p></li>
</ul>`);
    });

    it('code-example in table', () => {
      const md = `| AngularJS | Angular |
| :-------- | :------ |
| <header>Filters</header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.title &verbar; uppercase}} &NewLine; &lt;/td&gt; </code-example> To filter output in AngularJS templates, use the pipe (<code>&verbar;</code>) character and one or more filters. <br /> This example filters the \`title\` property to uppercase. | <header>Pipes</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="uppercase"></code-example> In Angular you use similar syntax with the pipe (<code>&verbar;</code>) character to filter output, but now you call them **pipes**. Many (but not all) of the built-in filters from AngularJS are built-in pipes in Angular. <br /> For more information, see [Filters/pipes][AioGuideAjsQuickReferenceFiltersPipes]. |`;
      const ast = Md.parse(md) as Parent;
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
    });

    it('embedded filetree', () => {
      const md = `<div class="filetree">
    <div class="children">
        <div class="file">
          environment.ts
        </div>
        <div class="file">
          environment.staging.ts
        </div>
    </div>
</div>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(`<html-raw value="%3Cdiv%20class%3D%22filetree%22%3E%0A%20%20%20%20%3Cdiv%20class%3D%22children%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22file%22%3E%0A%20%20%20%20%20%20%20%20%20%20environment.ts%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22file%22%3E%0A%20%20%20%20%20%20%20%20%20%20environment.staging.ts%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%3C%2Fdiv%3E%0A%3C%2Fdiv%3E"></html-raw>`);
    });

    it('angular doc @directives', () => {
      const md = `@description

abc

none @directive`;
      const ast = Md.parse(md) as Parent;
      expect(ast.children.length).toEqual(3);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
    });

    xit('embedded code-example with escape', () => {
      const md = `<code-example language="html">
  &lt;nav \[style.background-color]="expression"&gt;&lt;/nav&gt;

  &lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;
</code-example>`;
      const html = `<code-example language="html">

  &lt;nav [style.background-color]="expression">&lt;/nav>

  &lt;nav [style.backgroundColor]="expression">&lt;/nav>

</code-example>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });
    it('embedded block code', () => {
      const md = '```\nvar a = 1;\nvar b = 2;\n```';
      const html = `<pre><code>var a = 1;
var b = 2;
</code></pre>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded custom tag', () => {
      const md = `<t>a</t>`;
      const html = `<p><tag value="%3Ct%3E"></tag>a<tag value="%3C%2Ft%3E"></tag></p>`;
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });

    it('escaped text', () => {
      const ast = Md.parse(`&#8220;中文&mdash;&#8221;`);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(`“中文—”`);
    });

    it('originalId should mark with translate="no"', () => {
      const md = `# h1 {@originalId 123}`;
      const html = '<h1>h1<original-id translate="no" value="123"></original-id></h1>';
      const ast = Md.parse(md);
      // 重建 markdown
      expect(Md.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(Md.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(Md.toHtml(ast).trim()).toEqual(html);
    });
  });

  describe('should rebuild markdown exactly', () => {
    it('yaml front-matter', () => {
      const md = `---
title: abc
---

# Head 1`;
      const ast = Md.parse(md);
      expect(Md.stringify(ast)).toEqual(md);
    });

    it('reference links', () => {
      const md = `# section 1

[one][1]

# section 2

[1]: http://www.1.com`;
      const ast = Md.parse(md);
      expect(Md.stringify(ast)).toEqual(md);
    });

    it('strong/italic', () => {
      const md = `*a*_b_`;
      const ast = Md.parse(md);
      expect(Md.stringify(ast)).toEqual(md);
    });

    it('originalId', () => {
      const md = `# h1 {@originalId 123}`;
      const ast = Md.parse(md);
      expect(Md.stringify(ast)).toEqual(md);
    });

    xit('complex e2e', () => {
      const sample = `# h1

_a_ __a__ ***a***

11. a
12. b

**NOTE**: <br />
One

| a | b |
| --- | --- |
| <code-example format="typescript" hidecopy="" language="typescript"> declarations: [ &NewLine;&nbsp; MyRedComponent&NewLine;&nbsp; &NewLine;&nbsp;, MyBlueComponent &NewLine;&nbsp; MyDatePipe &NewLine;&NewLine;&nbsp;] </code-example> | List of components directives and pipes that belong to this module. |
| 1,2,3,4 | 2 |
| 3&nbsp;4 | 4&NewLine;5 |
| 5&nbsp;6 | <code-example>6&NewLine;7</code-example> |

<code-example language="html">
ng build --prod
cd dist
http-server -p 8080
</code-example>

{@a top}

[a][1][b](2)

* a
* b

## h2

* a
* b`;
      const html = Md.normalize(sample);
      expect(html).toEqual(sample);
    });
  });
});
