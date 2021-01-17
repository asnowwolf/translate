import { html } from './html';
import { VFile } from 'vfile';
import { getTranslateEngine, TranslationEngine } from './engine';
import { parse, read } from './file-utils';
import { containsChinese, TranslationEngineType } from './common';
import { markdown } from './markdown';
import { DictEntryModel } from './models/dict-entry.model';
import { JSDOM } from 'jsdom';
import { readFileSync, writeFileSync } from 'fs';
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

class CharsetNotSupportedError extends Error {
}


function indexInParent(node: Node): number {
  if (!node.parentNode) {
    return -1;
  }
  const siblings = node.parentNode.children;
  for (let i = 0; i < siblings.length; ++i) {
    if (siblings.item(i) === node) {
      return i;
    }
  }
  return -1;
}

export function getPathsTo(element: Element): string[] {
  if (!element || element.parentElement?.tagName === 'BODY') {
    return [];
  }
  return [...getPathsTo(element.parentElement), element.tagName, indexInParent(element).toString(10)];
}

function extractAllFromHtml(filename: string, outputHtml: boolean): DictEntryModel[] {
  const file = read(filename);
  const dom = parse(file);
  const doc = dom.window.document;
  checkCharset(doc);
  const pairs = extractAll(doc.body);
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

  translateFiles(files: string[]): Promise<VFile[]> {
    return this.transformFiles(files, (file) => this.translateFile(file));
  }

  async extractPairsFromHtml(files: string[], outputHtml: boolean): Promise<DictEntryModel[]> {
    return files.map(file => extractAllFromHtml(file, outputHtml)).flat(9);
  }

  async translateDoc(doc: Document): Promise<Document> {
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

  private async transformFiles(files: string[], transformer: (file: VFile) => Promise<VFile>): Promise<VFile[]> {
    return Promise.all(files.map(it => read(it)).map(transformer));
  }

  private translateFile(file: VFile): Promise<VFile> {
    console.log('translating: ', file.path);
    switch (file.extname) {
      case '.html':
      case '.htm':
        return this.translateHtml(file);
      case '.md':
      case '.markdown':
        return this.translateMarkdown(file);
      default:
        throw new Error('Unsupported file type');
    }
  }

  private async translateHtml(file: VFile): Promise<VFile> {
    const dom = parse(file);
    const doc = dom.window.document;
    checkCharset(doc);
    await this.translateDoc(doc);
    file.contents = dom.serialize();
    return file;
  }

  private async translateMarkdown(file: VFile): Promise<VFile> {
    const translation = await markdown.translate(file.contents as string, this.engine);
    file.contents = prettify(translation);
    return file;
  }

  private async translateElement(element: Element): Promise<string> {
    if (shouldIgnore(element)) {
      return element.innerHTML;
    }
    const translations = await this.engine.translate([element.innerHTML]);
    const resultNode = element.ownerDocument!.createElement(element.tagName);
    resultNode.innerHTML = translations[0];
    element.parentElement!.insertBefore(resultNode, element);
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

function checkCharset(doc: Document, charset = 'utf-8'): void {
  if (doc.charset !== charset.toUpperCase()) {
    throw new CharsetNotSupportedError();
  }
}

function textOf(node: Element, html: boolean): string {
  return (html ? node.innerHTML : node.textContent!).trim().replace(/\s+/g, ' ');
}

function shouldIgnore(element: Element): boolean {
  return !!element.querySelector('[translation-result]') || containsChinese(element.textContent!);
}

export function addTranslationMarks(files: string[]) {
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    writeFileSync(file, addTranslationMark(content), 'utf8');
  }
}

export function addTranslationMark(content: string): string {
  const dom = new JSDOM(content);
  const doc = dom.window.document;
  addIdForHeaders(doc.body);
  markAndSwapAll(doc.body);
  return dom.serialize();
}
