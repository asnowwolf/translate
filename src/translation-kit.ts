import { html } from './html';
import { concat, merge, Observable, of } from 'rxjs';
import { VFile } from 'vfile';
import { distinct, filter, finalize, flatMap, map, mapTo, switchMap, tap, toArray } from 'rxjs/operators';
import { getTranslateEngine, TranslationEngine } from './engine';
import { read } from './rx-file';
import { parse } from './rx-jsdom';
import { containsChinese, TranslationEngineType } from './common';
import { markdown } from './markdown';
import { DictEntryModel } from './models/dict-entry.model';
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

  private transformFiles(files: string[], transformer: (file: VFile) => Observable<VFile>): Observable<VFile> {
    const tasks = files.map(filename => of(filename).pipe(
      map(read()),
      switchMap(file => transformer(file)),
    ));
    return concat(...tasks);
  }

  private translateFile(file: VFile): Observable<VFile> {
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

  private translateHtml(file: VFile): Observable<VFile> {
    return of(file).pipe(
      map(parse()),
      switchMap(dom => of(dom).pipe(
        map(dom => dom.window.document),
        tap(checkCharset()),
        switchMap((doc) => this.translateDoc(doc)),
        mapTo(dom),
      )),
      map(dom => dom.serialize()),
      tap((html) => file.contents = html),
      mapTo(file),
    );
  }

  private translateMarkdown(file: VFile): Observable<VFile> {
    const ast = markdown.parse(file.contents);
    return markdown.translate(ast, this.engine).pipe(
      map(ast => markdown.stringify(ast)),
      tap(md => file.contents = prettify(md)),
      mapTo(file),
    );
  }

  translateFiles(files: string[]): Observable<VFile> {
    return this.transformFiles(files, (file) => this.translateFile(file)).pipe(
      finalize(() => this.engine.destroy()),
    );
  }

  private translateElement(element: Element): Observable<string> {
    if (shouldIgnore(element)) {
      return of(element.innerHTML);
    }
    return this.engine.translate(element.innerHTML).pipe(
      tap(result => {
        const resultNode = element.ownerDocument!.createElement(element.tagName);
        resultNode.innerHTML = result;
        element.parentElement!.insertBefore(resultNode, element);
        // 交换 id
        const id = element.getAttribute('id');
        if (id) {
          resultNode.setAttribute('id', id);
          element.removeAttribute('id');
        }
        resultNode.setAttribute('translation-result', 'on');
        element.setAttribute('translation-origin', 'off');
      }),
    );
  }

  private translateDoc(doc: Document): Observable<Document> {
    const translateTitleTask = this.engine.translate(doc.title).pipe(
      tap(title => doc.title = title),
    );

    const elements = this.selectors.map(selector => Array.from(doc.querySelectorAll(selector)))
      .reduce((result, item) => [...result, ...item]);
    const translateElementTasks = elements.map(element => this.translateElement(element));

    const tasks = [
      translateTitleTask,
      ...translateElementTasks,
    ];
    return merge(...tasks).pipe(
      tap(items => items),
      toArray(),
      mapTo(doc),
    );
  }

  extractPairs(files: string[], html: boolean): Observable<DictEntryModel> {
    const tasks = files.map(filename => of(filename).pipe(
      map(read()),
      switchMap(file => of(file).pipe(
        map(parse()),
        map(dom => dom.window.document),
        tap(checkCharset()),
        map(doc => extractAll(doc.body)),
        flatMap(pairs => pairs),
        map(({ english, chinese }) => ({ file: filename, english: textOf(english, html), chinese: textOf(chinese, html) })),
        filter(({ chinese }) => countOfChinese(chinese) > 4),
      )),
    ));
    return concat(...tasks).pipe(finalize(() => this.engine.destroy()));
  }

  extractLowQualifyResults(files: string[]): Observable<string> {
    const tasks = files.map((file) => of(file).pipe(
      map(read()),
      switchMap(file => of(file).pipe(
        map(parse()),
        map(dom => dom.window.document),
        tap(checkCharset()),
        map(doc => extractAll(doc.body)),
        flatMap(pairs => pairs),
        distinct(),
        map(({ english, chinese }) => ({ english: textOf(english, true), chinese: textOf(chinese, true) })),
        filter(({ english, chinese }) => {
          return chinese.indexOf(english) === -1 && // 排除中文完全包含英文的
            countOfChinese(chinese) >= 10 &&  // 中文字符数必须大于 10
            ((english.length > chinese.length * 4 || english.length < chinese.length) || // 英文长度和中文长度比例过大或过小
              wordCount(english, 'angular') !== wordCount(chinese, 'angular')); // 中文和英文中包含的 Angular 个数不一样
        }),
        map(({ english, chinese }) => `${english}(${english.length})\t|\t${chinese}(${chinese.length})`),
      )),
    ));
    return concat(...tasks).pipe(finalize(() => this.engine.destroy()));
  }
}

function checkCharset(charset = 'utf-8'): (doc: Document) => void {
  return (doc) => doc.charset !== charset.toUpperCase();
}

function wordCount(text: string, word: string): number {
  let count = 0;
  for (let i = 0; i < text.length; ++i) {
    if (text.slice(i, i + word.length).toLowerCase() === word) {
      ++count;
    }
  }
  return count;
}

function countOfChinese(chinese: string): number {
  let count = 0;
  for (let i = 0; i < chinese.length; ++i) {
    const code = chinese.charCodeAt(i);
    if (code >= 0x4e00 && code <= 0x9fa5) {
      ++count;
    }
  }
  return count;
}

export function injectTranslationKitToDoc(
  doc: HTMLDocument,
  styleUrls: string[], scriptUrls: string[], urlMap: Record<string, string>): void {
  injectTranslators(doc, styleUrls, scriptUrls);
  replaceResourceUrls(doc, urlMap);
}

export function injectTranslationKit(files: string[], styleUrls: string[], scriptUrls: string[],
                                     urlMap: Record<string, string>, textMap: Record<string, string>): Observable<VFile> {
  const tasks = files.map(filename => of(filename).pipe(
    map(read()),
    switchMap(file => of(file).pipe(
      map(parse()),
      switchMap(dom => of(dom).pipe(
        map(dom => dom.window.document),
        tap(checkCharset()),
        tap((doc) => injectTranslationKitToDoc(doc, styleUrls, scriptUrls, urlMap)),
        mapTo(dom),
      )),
      map(dom => dom.serialize()),
      map(html => replaceText(html, textMap)),
      tap((html) => file.contents = html),
      mapTo(file),
    )),
  ));
  return concat(...tasks);
}

function replaceText(text: string, textMap: Record<string, string>): string {
  Object.entries(textMap).forEach(([key, value]) => {
    text = text.replace(new RegExp(key, 'gi'), value);
  });
  return text;
}

export function addTranslationMarks(files: string[]): Observable<VFile> {
  const tasks = files.map(filename => of(filename).pipe(
    map(read()),
    switchMap(file => of(file).pipe(
      map(parse()),
      switchMap(dom => of(dom).pipe(
        map(dom => dom.window.document),
        tap(checkCharset()),
        tap((doc) => addTranslationMark(doc)),
        mapTo(dom),
      )),
      map(dom => dom.serialize()),
      tap((html) => file.contents = html),
      mapTo(file),
    )),
  ));
  return concat(...tasks);
}

function addTranslationMark(doc: Document): void {
  addIdForHeaders(doc.body);
  markAndSwapAll(doc.body);
}

function injectTranslators(doc: Document, styleUrls: string[] = [], scriptUrls: string[] = []): void {
  styleUrls.forEach(styleUrl => {
    if (styleSheetExists(styleSheetsOf(doc), styleUrl)) {
      return;
    }
    const link = doc.createElement('link');
    link.href = styleUrl;
    link.rel = 'stylesheet';
    doc.head.appendChild(link);
  });
  scriptUrls.forEach(scriptUrl => {
    if (scriptExists(scriptsOf(doc), scriptUrl)) {
      return;
    }
    const script = doc.createElement('script');
    script.src = scriptUrl;
    doc.body.appendChild(script);
  });
}

function replaceResourceUrls(doc: Document, urlMap: Record<string, string>): void {
  styleSheetsOf(doc).forEach(styleSheet => {
    const newValue = urlMap[styleSheet.href];
    if (newValue) {
      styleSheet.href = newValue;
    }
  });
  scriptsOf(doc).forEach(script => {
    const newValue = urlMap[script.src];
    if (newValue) {
      script.src = newValue;
    }
  });
  doc.querySelectorAll<HTMLImageElement>('img[src]').forEach(image => {
    const newValue = urlMap[image.src];
    if (newValue) {
      image.src = newValue;
    }
  });
}

function styleSheetExists(styleSheets: NodeListOf<HTMLLinkElement>, styleSheetUrl: string): boolean {
  for (let i = 0; i < styleSheets.length; ++i) {
    if (styleSheets.item(i)!.href === styleSheetUrl) {
      return true;
    }
  }
  return false;
}

function scriptExists(scripts: NodeListOf<HTMLScriptElement>, scriptUrl: string): boolean {
  for (let i = 0; i < scripts.length; ++i) {
    if (scripts.item(i)!.src === scriptUrl) {
      return true;
    }
  }
  return false;
}

function styleSheetsOf(doc: Document): NodeListOf<HTMLLinkElement> {
  return doc.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]');
}

function scriptsOf(doc: Document): NodeListOf<HTMLScriptElement> {
  return doc.querySelectorAll<HTMLScriptElement>('script[src]');
}

function textOf(node: Element, html: boolean): string {
  return (html ? node.innerHTML : node.textContent!).trim().replace(/\s+/g, ' ');
}

function shouldIgnore(element: Element): boolean {
  return !!element.querySelector('[translation-result]') || containsChinese(element.textContent!);
}
