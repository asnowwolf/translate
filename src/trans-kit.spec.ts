import { describe, it } from 'mocha';
import { expect } from 'chai';
import { writeFileSync } from 'fs';
import {
  addTranslationMark,
  autoTranslateFiles,
  checkCharset,
  extractFromFiles,
  injectTranslators,
  listFiles,
  parse,
  read,
  replaceResourceUrls,
  stringify,
  translate,
  write,
} from './trans-kit';
import { map, mapTo, switchMap, tap, toArray } from 'rxjs/operators';
import { of } from 'rxjs';

describe('trans-kit', function () {
  it('processTranslation', () => {
    const styleUrls = ['/assets/css/translator.css'];
    const scriptUrls = ['/assets/js/translator.js'];
    const urlMap = {
      'https://fonts.googleapis.com/icon?family=Material+Icons': '/assets/css/Material_Icons.css',
      'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,700': '/assets/css/Material_Icons.css',
    };

    return listFiles(exampleGlob).pipe(
      map(read()),
      switchMap(file => of(file).pipe(
        map(parse()),
        switchMap(dom => of(dom).pipe(
          mapTo(dom.window.document),
          tap(checkCharset()),
          tap(addTranslationMark()),
          tap(injectTranslators(styleUrls, scriptUrls)),
          tap(replaceResourceUrls(urlMap)),
          mapTo(dom),
        )),
        map(stringify()),
        tap(write(file)),
      )),
    ).toPromise();
  });
  it('extract all', () => {
    return extractFromFiles(exampleGlob, false).pipe(
      map(({ english, chinese }) => `${english}\t${chinese}`),
      toArray(),
      tap((result) => expect(result).eql([
        'Writing file contents\t编写文件内容',
      ])),
    ).toPromise();
  });
  it('translate one', () => {
    return translate(`<p>There are now 3 new APIs: <code>Query</code>, <code>Mutation</code> and <code>Subscription</code>. Each of them allows to define the shape of a result &amp; variables.
The only thing you need to do is to set the document property. That’s it, you use it as a regular Angular service.</p>`).pipe(
      tap(it => expect(it).eql('Service Worker 是一种技术')),
    ).toPromise();
  });
  it('translate all', () => {
    return autoTranslateFiles(__dirname + '/test/samples/quickstart.html').pipe(
      map(file => file.contents),
      tap((content => writeFileSync('./temp/test.html', content, 'utf-8'))),
    ).toPromise();
  });
});

const exampleGlob = __dirname + '/test/samples/**/*.html';

