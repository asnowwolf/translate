import { addIdForHeaders, defaultSelectors, extractAll, markAndSwapAll } from './html';
import { concat, Observable, of } from 'rxjs';
import { VFile } from 'vfile';
import { distinct, filter, flatMap, map, mapTo, switchMap, tap, toArray } from 'rxjs/operators';
import { getTranslateEngine, TranslationEngine } from './engine';
import { listFiles, read } from './rx-file';
import { parse } from './rx-jsdom';
import { TranslationEngineType } from './common';

export class TranslationKit {
  private engine: TranslationEngine;

  constructor(engine: TranslationEngine | TranslationEngineType, private selectors = defaultSelectors) {
    if (engine instanceof TranslationEngine) {
      this.engine = engine;
    } else {
      this.engine = getTranslateEngine(engine);
    }
  }

  transformFiles(sourceGlob: string, transformer: (doc: Document) => Observable<Document>): Observable<VFile> {
    return listFiles(sourceGlob).pipe(
      map(read()),
      switchMap(file => of(file).pipe(
        map(parse()),
        switchMap(dom => of(dom).pipe(
          map(dom => dom.window.document),
          tap(checkCharset()),
          switchMap((doc) => transformer(doc)),
          mapTo(dom),
        )),
        map(dom => dom.serialize()),
        tap((html) => file.contents = html),
        mapTo(file),
      )),
    );
  }

  translateFiles(sourceGlob: string): Observable<VFile> {
    return this.transformFiles(sourceGlob, (doc) => this.translateDoc(doc));
  }

  translateElement(element: Element): Observable<string> {
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

  translateDoc(doc: Document): Observable<Document> {
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
    return concat(...tasks).pipe(
      tap(items => items),
      toArray(),
      mapTo(doc),
    );
  }

  extractTrainingDataset(sourceGlob: string, unique = false): Observable<{ english: string, chinese: string }> {
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

  extractLowQualifyResults(sourceGlob: string): Observable<string> {
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

  injectTranslationKitToFiles(
    sourceGlob: string,
    styleUrls: string[],
    scriptUrls: string[],
    urlMap: Record<string, string>,
  ): Observable<VFile> {
    return this.transformFiles(sourceGlob, (doc) => {
      injectTranslationKitToDoc(doc, styleUrls, scriptUrls, urlMap);
      return of(doc);
    });
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

export function injectTranslationKitToDoc(doc, styleUrls: string[], scriptUrls: string[], urlMap: Record<string, string>): void {
  addTranslationMark(doc);
  injectTranslators(doc, styleUrls, scriptUrls);
  replaceResourceUrls(doc, urlMap);
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

function textOf(node: Element): string {
  return node.textContent!.trim().replace(/\s+/g, ' ');
}

function shouldIgnore(element: Element): boolean {
  return !!element.querySelector('[translation-result]');
}
