import { html } from './html';
import { getTranslateEngine, TranslationEngine } from './engine';
import { containsChinese, TranslationEngineType } from './common';
import { markdown } from './markdown';
import { DictEntryModel } from './models/dict-entry.model';
import { readFileSync, writeFileSync } from 'fs';
import { DomDocument, DomElement, DomParentNode } from './models/dom-models';
import { parse, parseFragment } from 'parse5';
import { treeAdapter } from './dom-tree-adapter';
import { extname } from 'path';
import { jsdoc } from './js-doc';
import extractAll = html.extractAll;
import defaultSelectors = html.defaultSelectors;
import addIdForHeaders = html.addIdForHeaders;
import markAndSwapAll = html.markAndSwapAll;

function prettify(md: string): string {
  return md
    .replace(/([\w`])([\u4e00-\u9fa5])/g, '$1 $2')
    .replace(/([\u4e00-\u9fa5])([\w`])/g, '$1 $2')
    .replace(/\n\n+/g, '\n\n');
}

export function getPathsTo(element: DomParentNode): string[] {
  if (!element || element instanceof DomElement && element.isTagOf('body')) {
    return [];
  }
  return [...getPathsTo(element.parentElement), element.nodeName, element.indexOfElement.toString(10)];
}

function extractAllFromHtml(filename: string, outputHtml: boolean): DictEntryModel[] {
  const doc = parse(readFileSync(filename, 'utf8'), { treeAdapter });
  const pairs = extractAll(doc);
  return pairs.map(pair => ({
    file: filename,
    xpath: getPathsTo(pair.english).join('/'),
    english: textOf(pair.english, outputHtml),
    chinese: textOf(pair.chinese, outputHtml),
  }));
}

export class TranslationKit {
  private engine: TranslationEngine;

  constructor(engine: TranslationEngine | TranslationEngineType, params: Record<string, any> = {}, private selectors = defaultSelectors) {
    if (engine instanceof TranslationEngine) {
      this.engine = engine;
    } else {
      this.engine = getTranslateEngine(engine);
    }
    this.engine.init(params);
  }

  async extractPairsFromHtml(files: string[], outputHtml: boolean): Promise<DictEntryModel[]> {
    return files.map(file => extractAllFromHtml(file, outputHtml)).flat(9);
  }

  async translateDoc(doc: DomDocument): Promise<DomDocument> {
    const titles = await this.engine.translate([doc.title]);
    doc.title = titles[0];

    const elements = this.selectors
      .map(selector => Array.from(doc.querySelectorAll(selector)))
      .flat();

    for (const element of elements) {
      await this.translateElement(element);
    }

    return doc;
  }

  async translateFile(file: string): Promise<void> {
    switch (extname(file)) {
      case '.html':
      case '.htm':
        await this.translateHtml(file);
        break;
      case '.md':
      case '.markdown':
        await this.translateMarkdown(file);
        break;
      case '.js':
      case '.ts':
      case '.jsx':
      case '.tsx':
        await this.translateJsDoc(file);
        break;
      default:
        throw new Error('Unsupported file type');
    }
  }

  private async translateHtml(file: string): Promise<void> {
    const doc = parse(readFileSync(file, 'utf8'), { treeAdapter });
    await this.translateDoc(doc);
    writeFileSync(file, doc.toHtml(), 'utf8');
  }

  private async translateMarkdown(file: string): Promise<void> {
    const translation = await markdown.translate(readFileSync(file, 'utf8'), this.engine);
    writeFileSync(file, prettify(translation), 'utf8');
  }

  private async translateJsDoc(file: string): Promise<void> {
    const translation = await jsdoc.translate(readFileSync(file, 'utf8'), this.engine);
    writeFileSync(file, translation, 'utf8');
  }

  private async translateElement(element: DomElement): Promise<string> {
    if (shouldIgnore(element)) {
      return element.innerHTML;
    }
    const translations = await this.engine.translate([element.innerHTML]);
    const resultNode = new DomElement(element.tagName);
    resultNode.innerHTML = translations[0];
    element.parentNode.insertBefore(resultNode, element);
    // 交换 id
    const id = element.getAttribute('id');
    if (id) {
      resultNode.setAttribute('id', id);
      element.removeAttribute('id');
    }
    resultNode.setAttribute('translation-result', 'on');
    element.setAttribute('translation-origin', 'off');
  }
}

function textOf(node: DomElement, html: boolean): string {
  return (html ? node.innerHTML : node.textContent!).trim().replace(/\s+/g, ' ');
}

function shouldIgnore(element: DomElement): boolean {
  return !!element.querySelector(it => it.hasAttribute('translation-result')) || containsChinese(element.textContent!);
}

export function addTranslationMark(content: string): string {
  const doc = parseFragment(content, { treeAdapter });
  addIdForHeaders(doc);
  markAndSwapAll(doc);
  return doc.toHtml();
}


export function injectTranslationKitToDoc(doc: DomDocument,
                                          styleUrls: string[], scriptUrls: string[], urlMap: Record<string, string>): void {
  injectTranslators(doc, styleUrls, scriptUrls);
  replaceResourceUrls(doc, urlMap);
}

export function injectTranslationKit(file: string, styleUrls: string[], scriptUrls: string[],
                                     urlMap: Record<string, string>, textMap: Record<string, string>): void {

  const content = readFileSync(file, 'utf8');
  const doc = parse(content, { treeAdapter });
  injectTranslationKitToDoc(doc, styleUrls, scriptUrls, urlMap);
  const result = replaceText(doc.toHtml(), textMap);
  writeFileSync(file, result, 'utf8');
}

function replaceText(text: string, textMap: Record<string, string>): string {
  Object.entries(textMap).forEach(([key, value]) => {
    text = text.replace(new RegExp(key, 'gi'), value);
  });
  return text;
}

function injectTranslators(doc: DomDocument, styleUrls: string[] = [], scriptUrls: string[] = []): void {
  styleUrls.forEach(styleUrl => {
    if (styleSheetExists(styleSheetsOf(doc), styleUrl)) {
      return;
    }
    const link = new DomElement('link', [{ name: 'href', value: styleUrl }, { name: 'rel', value: 'stylesheet' }]);
    doc.head.appendChild(link);
  });
  scriptUrls.forEach(scriptUrl => {
    if (scriptExists(scriptsOf(doc), scriptUrl)) {
      return;
    }
    const script = new DomElement('script', [{ name: 'src', value: scriptUrl }]);
    doc.body.appendChild(script);
  });
}

function replaceResourceUrls(doc: DomDocument, urlMap: Record<string, string>): void {
  styleSheetsOf(doc).forEach(styleSheet => {
    const newValue = urlMap[styleSheet.getAttribute('href')];
    if (newValue) {
      styleSheet.setAttribute('href', newValue);
    }
  });
  scriptsOf(doc).forEach(script => {
    const newValue = urlMap[script.getAttribute('src')];
    if (newValue) {
      script.setAttribute('src', newValue);
    }
  });
  doc.querySelectorAll<DomElement>(it => it.isTagOf('img') && it.hasAttribute('src')).forEach(image => {
    const newValue = urlMap[image.getAttribute('src')];
    if (newValue) {
      image.setAttribute('src', newValue);
    }
  });
}

function styleSheetExists(styleSheets: DomElement[], styleSheetUrl: string): boolean {
  for (let i = 0; i < styleSheets.length; ++i) {
    if (styleSheets[i].getAttribute('href') === styleSheetUrl) {
      return true;
    }
  }
  return false;
}

function scriptExists(scripts: DomElement[], scriptUrl: string): boolean {
  for (let i = 0; i < scripts.length; ++i) {
    if (scripts[i].getAttribute('src') === scriptUrl) {
      return true;
    }
  }
  return false;
}

function styleSheetsOf(doc: DomDocument): DomElement[] {
  return doc.querySelectorAll<DomElement>(it => it.isTagOf('link') && it.getAttribute('rel') === 'stylesheet');
}

function scriptsOf(doc: DomDocument): DomElement[] {
  return doc.querySelectorAll<DomElement>(it => it.isTagOf('script') && it.hasAttribute('src'));
}
