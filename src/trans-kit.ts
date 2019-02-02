import { JSDOM } from 'jsdom';
import { sync as globby } from 'globby';
import { addIdForHeaders, defaultSelectors, extractAll, markAndSwapAll } from './html';
import { concat, from, Observable, of } from 'rxjs';
import * as vfile from 'to-vfile';
import { VFile } from 'vfile';
import { distinct, filter, flatMap, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { extname, join } from 'path';
import { translate } from './engine';

export function listFiles(globPattern: string): Observable<string> {
  if (globPattern.indexOf('*') === -1 && extname(globPattern) === '.') {
    globPattern = join(globPattern, '**/*.html');
  }
  const files = globby(globPattern);
  return from(files);
}

export function read(charset = 'utf-8'): (path: string) => VFile {
  return (path) => vfile.readSync(path, charset);
}

export function parse(): (file: VFile) => JSDOM {
  return (file) => new JSDOM(file.contents);
}

export function stringify(): (JSDOM) => string {
  return (dom) => dom.serialize();
}

export function checkCharset(charset = 'utf-8'): (doc: Document) => void {
  return (doc) => doc.charset !== charset.toUpperCase();
}

export function write(file: VFile): (contents: string) => void {
  return (contents) => {
    file.contents = contents;
    vfile.writeSync(file);
  };
}

export function addTranslationMark(): (doc: Document) => void {
  return (doc: Document) => {
    addIdForHeaders(doc.body);
    markAndSwapAll(doc.body);
  };
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

function styleSheetsOf(doc: HTMLDocument): NodeListOf<HTMLLinkElement> {
  return doc.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]');
}

function scriptsOf(doc: HTMLDocument): NodeListOf<HTMLScriptElement> {
  return doc.querySelectorAll<HTMLScriptElement>('script[src]');
}

export function injectTranslators(styleUrls: string[] = [], scriptUrls: string[] = []): (doc: Document) => void {
  return (doc: Document) => {
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
  };
}

export function replaceResourceUrls(urlMap: Record<string, string>): (doc: Document) => void {
  return (doc: Document) => {
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
  };
}

function textOf(node: Element): string {
  return node.textContent!.trim().replace(/\s+/g, ' ');
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

export function extractFromFiles(sourceGlob: string, unique = false): Observable<{ english: string, chinese: string }> {
  return listFiles(sourceGlob).pipe(
    map(read()),
    switchMap(file => of(file).pipe(
      map(parse()),
      map(dom => dom.window.document),
      tap(checkCharset()),
      map(doc => extractAll(doc.body)),
      flatMap(pairs => pairs),
      map(({ english, chinese }) => ({ english: textOf(english), chinese: textOf(chinese) })),
      filter(({ chinese }) => countOfChinese(chinese) > 4),
    )),
    unique ? distinct() : tap(),
  );
}

export function autoCheckFiles(sourceGlob: string): Observable<string> {
  return listFiles(sourceGlob).pipe(
    map(read()),
    switchMap(file => of(file).pipe(
      map(parse()),
      map(dom => dom.window.document),
      tap(checkCharset()),
      map(doc => extractAll(doc.body)),
      flatMap(pairs => pairs),
      distinct(),
      map(({ english, chinese }) => ({ english: textOf(english), chinese: textOf(chinese) })),
      filter(({ english, chinese }) => {
        return chinese.indexOf(english) === -1 && // 排除中文完全包含英文的
          countOfChinese(chinese) >= 10 &&  // 中文字符数必须大于 10
          ((english.length > chinese.length * 4 || english.length < chinese.length) || // 英文长度和中文长度比例过大或过小
            wordCount(english, 'angular') !== wordCount(chinese, 'angular')); // 中文和英文中包含的 Angular 个数不一样
      }),
      map(({ english, chinese }) => `${english}(${english.length})\t|\t${chinese}(${chinese.length})`),
    )),
  );
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

export function autoTranslateFiles(sourceGlob: string): Observable<VFile> {
  return listFiles(sourceGlob).pipe(
    map(read()),
    switchMap(file => of(file).pipe(
      map(parse()),
      switchMap(dom => of(dom).pipe(
        map(dom => dom.window.document),
        tap(checkCharset()),
        switchMap((doc) => translateDoc(doc, defaultSelectors)),
        mapTo(dom),
      )),
      map(dom => dom.serialize()),
      tap((html) => file.contents = html),
      mapTo(file),
    )),
  );
}

function shouldIgnore(element: Element): boolean {
  return !!element.querySelector('[translation-result]');
}

function translateElement(element: Element): Observable<string> {
  if (shouldIgnore(element)) {
    return of(element.innerHTML);
  }
  return translate(element.innerHTML).pipe(
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

function translateDoc(doc: HTMLDocument, selectors: string[]): Observable<HTMLDocument> {
  const translateTitleTask = translate(doc.title).pipe(
    tap(title => doc.title = title),
  );

  const elements = selectors.map(selector => Array.from(doc.querySelectorAll(selector)))
    .reduce((result, item) => [...result, ...item]);
  const translateElementTasks = elements.map(element => translateElement(element));

  const tasks = [
    translateTitleTask,
    ...translateElementTasks,
  ];
  return concat(tasks).pipe(
    flatMap(items => items),
    mapTo(doc),
  );
}
