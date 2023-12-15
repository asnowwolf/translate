import { Parent } from 'mdast';
import { markdown } from './markdown';
import { FakeTranslationEngine } from '../../translation-engine/fake-engine';

describe('markdown', () => {
  describe('should convert to html and convert back to markdown(normalize)', () => {
    it('heading', () => {
      const md = `# h1`;
      const html = `<h1>h1</h1>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });

    it('do not parse code indented', () => {
      const md = `abc

      code

\`\`\`
fence
\`\`\`

def`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('should escape ()[]', () => {
      const md = `abc()[][link\\]](url)def`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });
    it('normalize list items', () => {
      const ast = markdown.parse(`
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
      expect(markdown.stringify(ast)).toEqual(normalized);
      expect(markdown.stringify(markdown.parse(normalized))).toEqual(normalized);
    });

    it('url', () => {
      const md = `[text](/url "title")`;
      const html = `<p><a href="/url" title="title">text</a></p>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded live-example', () => {
      const md = 'one<live-example src="abc">def</live-example>';
      const html = `<p>one<live-example src="abc">def</live-example></p>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(`<p>one<html-raw value="%3Clive-example%20src%3D%22abc%22%3Edef%3C%2Flive-example%3E"></html-raw></p>`);
    });

    it('embedded comment - inline', () => {
      const md = 'a<!--links-->b';
      const html = `<p>a<!--links-->b</p>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded comment - block', () => {
      const md = `<!--
links
-->`;
      const html = `<!--
links
-->`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded html', () => {
      const md = '<header>a</header>b';
      const html = `<p><tag value="%3Cheader%3E"></tag>a<tag value="%3C%2Fheader%3E"></tag>b</p>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
      expect(markdown.mdFromHtml(html).trim()).toEqual(md);
    });

    it('embedded br and inline code', () => {
      const md = 'one<br />`<table>`';
      const html = `<p>one<tag value="%3Cbr%20%2F%3E"></tag><code>&#x3C;table></code></p>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded code-example', () => {
      const md = `<code-example language="html">

ng build --prod
cd dist
http-server -p 8080

</code-example>`;
      const html = `<html-raw value="%3Ccode-example%20language%3D%22html%22%3E%0A%0Ang%20build%20--prod%0Acd%20dist%0Ahttp-server%20-p%208080%0A%0A%3C%2Fcode-example%3E"></html-raw>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });

    it('code-example in list', () => {
      const md = `* item 1

  <code-example language="html">

  http-server -p 8080

  </code-example>

* item 2`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(`<ul>
<li nt__marker="*"><p>item 1</p><html-raw value="%3Ccode-example%20language%3D%22html%22%3E%0A%0Ahttp-server%20-p%208080%0A%0A%3C%2Fcode-example%3E"></html-raw></li>
<li nt__marker="*"><p>item 2</p></li>
</ul>`);
    });

    it('code-example in table', () => {
      const md = `| AngularJS                                                                                                                                                                                                                                                                                                                                                           | Angular                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <header>Filters</header> <code-example hideCopy format="html" language="html"> &lt;td&gt; &NewLine; &nbsp; {{movie.title &verbar; uppercase}} &NewLine; &lt;/td&gt; </code-example> To filter output in AngularJS templates, use the pipe (<code>&verbar;</code>) character and one or more filters. <br /> This example filters the \`title\` property to uppercase. | <header>Pipes</header> <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="uppercase"></code-example> In Angular you use similar syntax with the pipe (<code>&verbar;</code>) character to filter output, but now you call them **pipes**. Many (but not all) of the built-in filters from AngularJS are built-in pipes in Angular. <br /> For more information, see [Filters/pipes][AioGuideAjsQuickReferenceFiltersPipes]. |`;
      const ast = markdown.parse(md) as Parent;
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('embedded filetree with double quote', () => {
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
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(`<html-raw value="%3Cdiv%20class%3D%22filetree%22%3E%0A%20%20%20%20%3Cdiv%20class%3D%22children%22%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22file%22%3E%0A%20%20%20%20%20%20%20%20%20%20environment.ts%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22file%22%3E%0A%20%20%20%20%20%20%20%20%20%20environment.staging.ts%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%3C%2Fdiv%3E%0A%3C%2Fdiv%3E"></html-raw>`);
    });

    it('embedded filetree with single quote', () => {
      const md = `abc

<div class='filetree'>
    <div class="children">
        <div class="file">
          environment.ts
        </div>
        <div class="file">
          environment.staging.ts
        </div>
    </div>
</div>

def`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('embedded filetree without quote', () => {
      const md = `<div class=filetree>
    <div class="children">
        <div class="file">
          environment.ts
        </div>
        <div class="file">
          environment.staging.ts
        </div>
    </div>
</div>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('angular doc @directives', () => {
      const md = `@description

abc

none @directive`;
      const ast = markdown.parse(md) as Parent;
      expect(ast.children.length).toEqual(3);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(`@description

abc

none @directive`);
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
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });
    it('embedded block code', () => {
      const md = '```\nvar a = 1;\nvar b = 2;\n```';
      const html = `<pre><code>var a = 1;
var b = 2;
</code></pre>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });

    it('embedded custom tag', () => {
      const md = `<t>a</t>`;
      const html = `<p><tag value="%3Ct%3E"></tag>a<tag value="%3C%2Ft%3E"></tag></p>`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
      // 从 html 转换成 markdown
      expect(markdown.mdFromHtml(html)).toEqual(md);
      // 从 markdown 转换成 html
      expect(markdown.toHtml(ast).trim()).toEqual(html);
    });

    it('escaped text', () => {
      const ast = markdown.parse(`&#8220;中文&mdash;&#8221;`);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(`“中文&mdash;”`);
    });

    it('{@link foo}', () => {
      const md = `...{@link foo}...`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('{@a foo}', () => {
      const md = `...{@a foo}...`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('{@searchKeywords foo}', () => {
      const md = `...{@searchKeywords foo}...`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('@name one', () => {
      const md = `@name one`;
      const ast = markdown.parse(md);
      // 重建 markdown
      expect(markdown.stringify(ast)).toEqual(md);
    });
  });

  describe('should rebuild markdown exactly', () => {
    it('yaml front-matter', () => {
      const md = `---
title: abc
---

# Head 1`;
      const ast = markdown.parse(md);
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('reference links', () => {
      const md = `# section 1

[one][1]

# section 2

[1]: http://www.1.com`;
      const ast = markdown.parse(md);
      expect(markdown.stringify(ast)).toEqual(md);
    });

    it('strong/italic', () => {
      const md = `*a*_b_`;
      const ast = markdown.parse(md);
      expect(markdown.stringify(ast)).toEqual(md);
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
      const html = markdown.normalize(sample);
      expect(html).toEqual(sample);
    });
  });

  describe('visit markdown ast', () => {
    it('extract', async () => {
      const md = `---
title: 零
title$$origin: zero
---

# one

# 一

two

二

three
`;
      const ast = markdown.parse(md);
      const result = [];
      await markdown.visit(ast, undefined, async (original, translation) => {
        result.push({ original, translation });
        return undefined;
      });
      expect(result).toEqual([
        { original: 'zero', translation: '零' },
        { original: '# one', translation: '# 一' },
        { original: 'two', translation: '二' },
        { original: 'three' },
      ]);
    });

    it('translate', async () => {
      const md = `---
title: one
description: 二
description$$origin: two
---

# one

# 一

two

二

three

| four | five |
| ---- | ---- |
| 四 | 五 |
| s\\\|ix | se&verbar;ven |

1. eight

   八

2. nine
3. ten`;
      const ast = markdown.parse(md);
      const engine = new FakeTranslationEngine();
      markdown.visit(ast, undefined, async (original, translation) => {
        if (!translation) {
          return engine.translate(original, '', 'markdown');
        } else {
          return translation;
        }
      }).then(doc => {
        expect(markdown.stringify(doc)).toEqual(`---
title: 译one
description: 二
description$$origin: two
title$$origin: one

---

# one

# 一

two

二

three

译three

| four          | five            |
| ------------- | --------------- |
| 四            | 五              |
| s&verbar;ix   | se&verbar;ven   |
| 译s&verbar;ix | 译se&verbar;ven |

1. eight

   八

2. nine

   译nine

3. ten

   译ten`);
      });
      await engine.flush();
    });
  });
});
