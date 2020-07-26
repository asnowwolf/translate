import { describe, it } from 'mocha';
import { expect } from 'chai';
import { finalize, map, tap } from 'rxjs/operators';
import { FakeTranslator } from './engine';
import { merge } from 'rxjs';

describe('translation engine', function () {
  it('translate one sentence with fake engine', () => {
    const engine = new FakeTranslator();
    return engine.translate('<h1>Hello, world!</h1>')
      .pipe(
        map(text => expect(text).eql('<h1>译Hello, world!</h1>')),
        finalize(() => engine.destroy()),
      )
      .toPromise();
  });
  it('translate multi sentences with fake engine', () => {
    const engine = new FakeTranslator();
    return merge(
      engine.translate('one').pipe(tap(result => expect(result).eql('[译]one'))),
      engine.translate('two').pipe(tap(result => expect(result).eql('[译]two'))),
      engine.translate('three').pipe(tap(result => expect(result).eql('[译]three'))),
    ).pipe(
      // 无论翻译多少文本，批量翻译 API 都只应该调用一次
      tap(() => expect(engine.batchApiCalls).eql(1)),
      finalize(() => engine.destroy()),
    ).toPromise();
  });
});
