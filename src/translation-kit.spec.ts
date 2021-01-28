import { addTranslationMark, injectTranslationKitToDoc, TranslationKit } from './translation-kit';
import { treeAdapter } from './dom-tree-adapter';
import { parse } from 'parse5';

describe('translation-kit', () => {
  it('inject translation kit', () => {
    const styleUrls = ['/assets/css/translator.css'];
    const scriptUrls = ['/assets/js/translator.js'];
    const urlMap: Record<string, string> = {
      'https://fonts.googleapis.com/icon?family=Material+Icons': '/assets/css/Material_Icons.css',
      'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,700': '/assets/css/Source_Sans_Pro.css',
    };

    const doc = parse(`<!doctype html><html>
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,700">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body>
<p>one</p>
<p>一</p>
<h1>two</h1>
<h1>二</h1>
</body>
</html>`, { treeAdapter });
    injectTranslationKitToDoc(doc, styleUrls, scriptUrls, urlMap);
    expect(doc.toHtml()).toEqual(`<!DOCTYPE html><html><head>
  <link rel="stylesheet" href="/assets/css/Source_Sans_Pro.css">
  <link rel="stylesheet" href="/assets/css/Material_Icons.css">
<link href="/assets/css/translator.css" rel="stylesheet"></head>
<body>
<p>one</p>
<p>一</p>
<h1>two</h1>
<h1>二</h1>

<script src="/assets/js/translator.js"></script></body></html>`);
  });

  it('extract pairs from html', async () => {
    const kit = new TranslationKit();
    const entries = await kit.extractPairsFromHtml(
      ['samples/html/extract1.html', 'samples/html/extract2.html'],
      true);
    expect(entries).toEqual([
      {
        'chinese': '一',
        'english': 'One',
        'file': 'samples/html/extract1.html',
        'xpath': 'p/1',
      },
      {
        'chinese': '二',
        'english': 'Two',
        'file': 'samples/html/extract1.html',
        'xpath': 'div/2/p/1',
      },
      {
        'chinese': '三',
        'english': 'Three',
        'file': 'samples/html/extract2.html',
        'xpath': 'p/1',
      },
      {
        'chinese': '四',
        'english': 'Four',
        'file': 'samples/html/extract2.html',
        'xpath': 'div/2/p/1',
      },
    ]);
  });

  it('should add translation mark', () => {
    const result = addTranslationMark('<h1>english</h1><h1>中文</h1><p>one</p><p>一</p><p>two</p><p>three</p>');
    expect(result).toEqual('<h1 id="english" translation-result="on">中文</h1><h1 translation-origin="off">english</h1><p translation-result="on">一</p><p translation-origin="off">one</p><p>two</p><p>three</p>');
  });
});
