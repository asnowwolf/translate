import { describe, it } from 'mocha';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { html } from './html';
import restructureTable = html.restructureTable;
import markAndSwapAll = html.markAndSwapAll;
import addIdForHeaders = html.addIdForHeaders;
import extractAll = html.extractAll;

describe('html', function () {
  it('should mark and restructure table', () => {
    const dom = new JSDOM(`<table>
<thead>
<tr>
  <th>one</th>
  <th>two</th>
</tr>
</thead>
<tbody>
<tr>
  <td>一</td>
  <td>二</td>
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
    const body = dom.window.document.body;
    restructureTable(body);
    expect(body.innerHTML).eql(`<table>
<thead>
<tr>
  <th><p>one</p><p>一</p></th>
  <th><p>two</p><p>二</p></th>
</tr>
</thead>
<tbody>

<tr>
  <td><p>three</p><p>三</p></td>
  <td><p>four</p><p>四</p></td>
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
    const dom = new JSDOM(`<p id="a">a</p>
<p id="one">one</p>
<p id="一">一</p>
<script>const a = 1;</script>`);
    const body = dom.window.document.body;
    markAndSwapAll(body);
    expect(body.innerHTML).eql(`<p id="a">a</p>
<p id="one" translation-result="on">一</p><p translation-origin="off">one</p>

<script>const a = 1;</script>`);
  });

  it('should mark and swap anchors in Hn', () => {
    const dom = new JSDOM(`<h3 id="english_id">
<a id="english_id" class="anchor" href="#english_id" aria-hidden="true"><span class="octicon octicon-link"></span></a>
english content</h3>
<h3 id="中文标题">
<a id="中文标题" class="anchor" href="#%E4%B8%AD%E6%96%87%E6%A0%87%E9%A2%98" aria-hidden="true">
<span class="octicon octicon-link"></span></a>
中文内容</h3>`);
    const body = dom.window.document.body;
    markAndSwapAll(body);
    expect(body.innerHTML).eql(`<h3 id="english_id" translation-result="on">
<a id="中文标题" class="anchor" href="#english_id" aria-hidden="true">
<span class="octicon octicon-link"></span></a>
中文内容</h3><h3 translation-origin="off">
<a id="english_id" class="anchor" href="#english_id" aria-hidden="true"><span class="octicon octicon-link"></span></a>
english content</h3>
`);
  });
  it('should add id for headers', () => {
    const dom = new JSDOM(`<h1>a%b -1</h1><h2>one</h2><h3>一</h3>`);
    const body = dom.window.document.body;
    addIdForHeaders(body);
    expect(body.innerHTML).eql(`<h1 id="ab--1">a%b -1</h1><h2 id="one">one</h2><h3 id="一">一</h3>`);
  });

  it('should extract sentence pair', () => {
    const dom = new JSDOM(`<p id="a">a</p>
<p id="one"><a aria-hidden="true"></a>one</p><p id="一">一</p>
<script>const a = 1;</script>
<p id="one">two</p><p id="一">二</p>`);
    const body = dom.window.document.body;
    markAndSwapAll(body);
    const sentencePairs = extractAll(body).map(({ english, chinese }) => ({
      english: english.textContent!,
      chinese: chinese.textContent!,
    }));
    expect(sentencePairs).eql([
      {
        'chinese': '一',
        'english': 'one',
      },
      {
        'chinese': '二',
        'english': 'two',
      },
    ]);
  });
});
