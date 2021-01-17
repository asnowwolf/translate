import { getTranslateEngine } from './engine';
import { TranslationEngineType } from './common';
import { TranslationKit } from './translation-kit';
import { JSDOM } from 'jsdom';

describe('translation-kit', () => {
  it('auto translate html', async () => {
    const engine = getTranslateEngine(TranslationEngineType.fake);
    const kit = new TranslationKit(engine);
    const dom = new JSDOM(`<!doctype html>
<html lang="en-US">
<head>
  <title>english</title>
</head>
<body>
<p>one</p>
<div>two</div>
<div>three <a href="./sample-en.html">four</a></div>
<div>five<p>six</p></div>
<ul>
  <li>seven</li>
  <li>
    eight
    <ul>
      <li>nine</li>
    </ul>
  </li>
</ul>
</body>
</html>`);

    const doc = await kit.translateDoc(dom.window.document);
    expect(doc.title).toEqual('[译]english');
    expect(doc.body.innerHTML.trim()).toEqual(`<p translation-result="on">[译]one</p><p translation-origin="off">one</p>
<div>two</div>
<div>three <a href="./sample-en.html">four</a></div>
<div>five<p translation-result="on">[译]six</p><p translation-origin="off">six</p></div>
<ul>
  <li>seven</li>
  <li>
    eight
    <ul>
      <li>nine</li>
    </ul>
  </li>
</ul>`);
  });
  it('extract pairs from html', async () => {
    const engine = getTranslateEngine(TranslationEngineType.fake);
    const kit = new TranslationKit(engine);
    const entries = await kit.extractPairsFromHtml(
      ['src/test/samples/simple/extract1.html', 'src/test/samples/simple/extract2.html'],
      true);
    expect(entries).toEqual([
      {
        chinese: '一',
        english: 'One',
        file: 'src/test/samples/simple/extract1.html',
        xpath: '',
      },
      {
        chinese: '二',
        english: 'Two',
        file: 'src/test/samples/simple/extract1.html',
        xpath: 'P/1',
      },
      {
        chinese: '三',
        english: 'Three',
        file: 'src/test/samples/simple/extract2.html',
        xpath: '',
      },
      {
        chinese: '四',
        english: 'Four',
        file: 'src/test/samples/simple/extract2.html',
        xpath: 'P/1',
      },
    ]);
  });
});
