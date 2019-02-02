import { describe, it } from 'mocha';
import { expect } from 'chai';
import { writeFileSync } from 'fs';
import {
  addTranslationMark,
  autoTranslateFiles,
  checkCharset,
  injectTranslators,
  listFiles,
  parse,
  read,
  replaceResourceUrls,
  stringify,
  write,
} from './trans-kit';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { translate } from './engine';

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
  it('translate one', () => {
    return translate(`Service Worker is a technology`).pipe(
      tap(it => expect(it).eql('Service Worker 是一种技术')),
    ).toPromise();
  });
  it('translate one file', () => {
    return autoTranslateFiles('./src/test/samples/sample-en.html').pipe(
      map(file => file.contents),
      tap((content => writeFileSync('./src/test/samples/sample-cn.html', content, 'utf-8'))),
    ).toPromise();
  });
  it('translate all files', () => {
    return autoTranslateFiles(__dirname + '/test/samples/**/*.html').pipe(
      map(file => file.contents),
      tap((content => writeFileSync('./temp/test.html', content, 'utf-8'))),
    ).toPromise();
  });
});

const exampleGlob = __dirname + '/test/samples/**/*.html';

