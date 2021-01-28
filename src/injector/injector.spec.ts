import { Injector } from './injector';

describe('injector', () => {
  it('inject translation kits', async () => {
    const styleUrls = ['/assets/css/translator.css'];
    const scriptUrls = ['/assets/js/translator.js'];
    const urlMap: Record<string, string> = {
      'https://fonts.googleapis.com/icon?family=Material+Icons': '/assets/css/Material_Icons.css',
      'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,700': '/assets/css/Source_Sans_Pro.css',
    };

    const injector = new Injector(styleUrls, scriptUrls, urlMap, {});

    const result = await injector.inject(`<!doctype html><html>
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

    expect(result).toEqual(`<!DOCTYPE html><html><head>
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
});
