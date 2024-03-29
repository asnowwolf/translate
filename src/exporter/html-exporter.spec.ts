import { HtmlExporter, restructureTable } from './html-exporter';
import { defaultSelectors, DomDocumentFragment } from '../dom/parse5/dom-models';

describe('html exporter', () => {
  it('should add translation mark', () => {
    const exporter = new HtmlExporter();
    const result = exporter.exportContent('<!DOCTYPE html><html><head><title>abc</title></head><body class="abc"><h1>english</h1><h1>中文</h1><p>one</p><p>一</p><p>two</p><p>three</p></body></html>', {
      outputDir: '.',
      mono: false,
    });
    expect(result).toEqual('<!DOCTYPE html><html><head><title>abc</title></head><body class="abc"><h1 id="english" translation-result="on">中文</h1><h1 translation-origin="off">english</h1><p translation-result="on">一</p><p translation-origin="off">one</p><p>two</p><p>three</p></body></html>');
  });
  it('should mark and restructure table', () => {
    const doc = DomDocumentFragment.parse(`<table>
<thead>
<tr>
  <th>one<div>1</div></th>
  <th>two<div>2</div></th>
</tr>
</thead>
<tbody>
<tr>
  <td>一<div>1</div></td>
  <td>二<div>2</div></td>
</tr>
<tr>
  <td>three</td>
  <td>four</td>
</tr>
<tr>
  <td>三</td>
  <td>四</td>
</tr>
<tr>
  <td>
    <p>five</p>
    <p>五</p>
  </td>
  <td>
    <p>six</p>
    <p>六</p>
  </td>
</tr>
</tbody>
</table>`);
    restructureTable(doc);
    expect(doc.toHtml()).toEqual(`<table>
<thead>
<tr>
  <th><nt-wrapper>one<div>1</div></nt-wrapper><nt-wrapper>一<div>1</div></nt-wrapper></th>
  <th><nt-wrapper>two<div>2</div></nt-wrapper><nt-wrapper>二<div>2</div></nt-wrapper></th>
</tr>
</thead>
<tbody>

<tr>
  <td><nt-wrapper>three</nt-wrapper><nt-wrapper>三</nt-wrapper></td>
  <td><nt-wrapper>four</nt-wrapper><nt-wrapper>四</nt-wrapper></td>
</tr>

<tr>
  <td>
    <p>five</p>
    <p>五</p>
  </td>
  <td>
    <p>six</p>
    <p>六</p>
  </td>
</tr>
</tbody>
</table>`);
  });
  it('should mark and swap translation and origin', () => {
    const doc = DomDocumentFragment.parse(`<p id="a">a</p>
<p id="one">one</p>
<p id="一">一</p>
<script>const a = 1;</script>`);
    const exporter = new HtmlExporter();
    exporter.markAndSwapAll(doc);
    expect(doc.toHtml()).toEqual(`<p id="a">a</p>
<p id="one" translation-result="on">一</p><p translation-origin="off">one</p>

<script>const a = 1;</script>`);
  });

  it('should generate chinese only translation', () => {
    const exporter = new HtmlExporter();
    const result = exporter.exportContent(`<p id="a">a</p>
<p id="one">one</p>
<p id="一">一</p>
<script>const a = 1;</script>`, { outputDir: '.', mono: true });
    expect(result).toEqual(`<p id="a">a</p>
<p id="one">一</p>

<script>const a = 1;</script>`);
  });

  it('should mark and swap anchors in Hn', () => {
    const doc = DomDocumentFragment.parse(`<h3 id="english_id">
<a id="english_id" class="anchor" href="#english_id" aria-hidden="true"><span class="octicon octicon-link"></span></a>
english content</h3>
<h3 id="中文标题">
<a id="中文标题" class="anchor" href="#%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98" aria-hidden="true">
<span class="octicon octicon-link"></span></a>
中文内容</h3>`);
    const exporter = new HtmlExporter();
    exporter.markAndSwapAll(doc);
    expect(doc.toHtml()).toEqual(`<h3 id="english_id" translation-result="on">
<a id="中文标题" class="anchor" href="#english_id" aria-hidden="true">
<span class="octicon octicon-link"></span></a>
中文内容</h3><h3 translation-origin="off">
<a id="english_id" class="anchor" href="#english_id" aria-hidden="true"><span class="octicon octicon-link"></span></a>
english content</h3>
`);
  });
  it('should add id for headers', () => {
    const doc = DomDocumentFragment.parse(`<h1>a%b -1</h1><h2>one</h2><h3>一</h3>`);
    const exporter = new HtmlExporter();
    exporter.addIdForHeaders(doc);
    expect(doc.toHtml()).toEqual(`<h1 id="ab--1">a%b -1</h1><h2 id="one">one</h2><h3 id="一">一</h3>`);
  });
  it('support custom selector', () => {
    const doc = DomDocumentFragment.parse(`<header>a%b -1</header><header>one</header><header>一</header><h2 id="one">one</h2><h2 id="一">一</h2>`);
    const exporter = new HtmlExporter([...defaultSelectors, (node) => node.isTagOf('header')]);
    exporter.markAndSwapAll(doc);
    expect(doc.toHtml()).toEqual('<header>a%b -1</header><header translation-result="on">一</header><header translation-origin="off">one</header><h2 id="one" translation-result="on">一</h2><h2 translation-origin="off">one</h2>');
  });
});
