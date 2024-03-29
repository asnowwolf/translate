import { HtmlTranslator } from './html-translator';
import { readFileSync } from 'fs';
import { FakeTranslationEngine } from '../translation-engine/fake-engine';
import { ExtractorEngine } from '../translation-engine/extractor-engine';
import { TranslationEngineType } from '../translation-engine/translation-engine-type';

describe('html-translator', () => {
  it('translate html file', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const original = readFileSync('samples/html/demo.html', 'utf8');
    const translation = await translator.translateContentAndFlushStandalone(original, { htmlFragment: false });
    const expected = readFileSync('samples/html/demo-translated.html', 'utf8');
    expect(translation.trim()).toEqual(expected.trim());
  });

  it('should extract from html file', async () => {
    const engine = new ExtractorEngine({ dict: 'src/dict/examples', cwd: 'samples/html' });
    const translator = new HtmlTranslator(engine);
    await translator.translateFile('samples/html/demo-translated.html', { engine: TranslationEngineType.extractor });
    const markdownDict = readFileSync('src/dict/examples/demo-translated.dict.md', 'utf8');
    expect(markdownDict).toEqual(`one

译one

# one

# 译one

two

译two

six

译six

seven

译seven

eight

译eight

nine

译nine`);
  });

  it('translate simple html fragment file with fake engine', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const result = await translator.translateContentAndFlushStandalone('<p translation-origin="off">One</p>', { htmlFragment: true });

    expect(result).toEqual('<p translation-origin="off">One</p><p translation-result="on">译One</p>');
  });

  it('translate complex html fragment file with fake engine', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const result = await translator.translateContentAndFlushStandalone(`<li>
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
</li>`, {});

    expect(result).toEqual(`<li>
  <p translation-origin="off">a<a href="/1">One</a>b</p>
  <p translation-result="on">译a<a href="/1">译One</a>译b</p>
  <p translation-origin="off">Two</p>
  <p translation-result="on">译Two</p>
  <p translation-origin="off">Three</p>
  <p translation-result="on">译Three</p>
  <ul>
    <li>
      <p translation-origin="off">Four</p>
      <p translation-result="on">译Four</p>
    </li>
  </ul>
  <table>
    <tbody><tr>
      <td>
        <p translation-origin="off">Five</p>
        <p translation-result="on">译Five</p>
      </td>
      <td>
        <p translation-origin="off">Six</p>
        <p translation-result="on">译Six</p>
      </td>
    </tr>
  </tbody></table>
</li>`);
    expect(engine.totalBytes).toEqual(88);
  });

  it('only translate one time', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const result = await translator.translateContentAndFlushStandalone(`<li>
<p translation-origin="off">One</p>
<p translation-result="on">One译</p>
</li>`, { htmlFragment: true });

    expect(result).toEqual(`<li>
<p translation-origin="off">One</p>
<p translation-result="on">One译</p>
</li>`);
  });

  it('does not change when the original and the translation are the same', async () => {
    const engine = new FakeTranslationEngine();
    const translator = new HtmlTranslator(engine);
    const result = await translator.translateContentAndFlushStandalone(`<li>
<p>no-translate</p>
</li>`, { htmlFragment: true });

    expect(result).toEqual(`<li>
<p>no-translate</p>
</li>`);
  });
});
