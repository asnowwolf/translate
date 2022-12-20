import { HtmlTranslator } from './html-translator';
import { readFileSync } from 'fs';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';

describe('html-translator', () => {
  it('translate html file', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const original = readFileSync('samples/html/demo.html', 'utf8');
    const translation = await translator.translateContent(original, { htmlFragment: false });
    const expected = readFileSync('samples/html/demo-translated.html', 'utf8');
    expect(translation.trim()).toEqual(expected.trim());
  });

  it('translate simple html fragment file with fake engine', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const result = await translator.translateContent('<p translation-origin="off">One</p>', { htmlFragment: true });

    expect(result).toEqual('<p translation-result="on">译One</p><p translation-origin="off">One</p>');
  });

  it('translate complex html fragment file with fake engine', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const result = await translator.translateContent(`<li>
  a<a href="/1">One</a>b
  <p>Two</p>
  <p>Three</p>
  <ul>
    <li>Four</li>
  </ul>
  <table>
    <tr>
      <td>Five</td>
      <td>Six</td>
    </tr>
  </table>
</li>`, { htmlFragment: true });

    expect(result).toEqual(`<li>
  <p translation-result="on">译a<a href="/1">译One</a>译b</p>
  <p translation-origin="off">a<a href="/1">One</a>b</p>
  <p translation-result="on">译Two</p>
  <p translation-origin="off">Two</p>
  <p translation-result="on">译Three</p>
  <p translation-origin="off">Three</p>
  <ul>
    <li>
      <p translation-result="on">译Four</p>
      <p translation-origin="off">Four</p>
    </li>
  </ul>
  <table>
    <tbody><tr>
      <td>
        <p translation-result="on">译Five</p>
        <p translation-origin="off">Five</p>
      </td>
      <td>
        <p translation-result="on">译Six</p>
        <p translation-origin="off">Six</p>
      </td>
    </tr>
  </tbody></table>
</li>`);
    expect(engine.totalBytes).toEqual(46);
  });

  it('only translate one time', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const result = await translator.translateContent(`<li>
<p translation-result="on">One译</p>
<p translation-origin="off">One</p>
</li>`, { htmlFragment: true });

    expect(result).toEqual(`<li>
<p translation-result="on">One译</p>
<p translation-origin="off">One</p>
</li>`);
  });

  it('does not change when the original and the translation are the same', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const result = await translator.translateContent(`<li>
<p>no-translate</p>
</li>`, { htmlFragment: true });

    expect(result).toEqual(`<li>
<p>no-translate</p>
</li>`);
  });
});
