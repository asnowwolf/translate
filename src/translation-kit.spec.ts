import { describe, it } from 'mocha';
import { expect } from 'chai';
import { tap } from 'rxjs/operators';
import { getTranslateEngine } from './engine';
import { TranslationEngineType } from './common';
import { injectTranslationKitToDoc, TranslationKit } from './translation-kit';
import { JSDOM } from 'jsdom';

describe('translation-kit', function () {
  it('inject translation kit', () => {
    const styleUrls = ['/assets/css/translator.css'];
    const scriptUrls = ['/assets/js/translator.js'];
    const urlMap: Record<string, string> = {
      'https://fonts.googleapis.com/icon?family=Material+Icons': '/assets/css/Material_Icons.css',
      'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,700': '/assets/css/Source_Sans_Pro.css',
    };

    const dom = new JSDOM(`<!doctype html><html>
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
</html>`);
    const doc = dom.window.document;
    injectTranslationKitToDoc(doc, styleUrls, scriptUrls, urlMap);
    expect(dom.serialize()).eql(`<!DOCTYPE html><html><head>
  <link rel="stylesheet" href="/assets/css/Source_Sans_Pro.css">
  <link rel="stylesheet" href="/assets/css/Material_Icons.css">
<link href="/assets/css/translator.css" rel="stylesheet"></head>
<body>
<p translation-result="on">一</p><p translation-origin="off">one</p>

<h1 id="two" translation-result="on">二</h1><h1 translation-origin="off">two</h1>


<script src="/assets/js/translator.js"></script></body></html>`);
  });
  it('auto translate html', () => {
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

    return kit.translateDoc(dom.window.document).pipe(
      tap(doc => expect(doc.title).eql('[译]english')),
      tap(doc => expect(doc.body.innerHTML.trim()).eql(`<p translation-result="on">[译]one</p><p translation-origin="off">one</p>
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
</ul>`)),
    ).toPromise();
  });
});
