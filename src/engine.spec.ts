import { describe, it } from 'mocha';
import { expect } from 'chai';
import { map } from 'rxjs/operators';
import { getTranslateEngine } from './engine';
import { TranslationEngineType } from './common';

describe('translation engine', function () {
  it('get fake engine', () => {
    const engine = getTranslateEngine(TranslationEngineType.fake);
    return engine.translate('<h1>Hello, world!</h1>')
      .pipe(map(text => expect(text).eql('<h1>译Hello, world!</h1>')))
      .toPromise();
  });
});
