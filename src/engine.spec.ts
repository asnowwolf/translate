import { describe, it } from 'mocha';
import { expect } from 'chai';
import { translateByAutoML, translateByMsTranslator } from './engine';
import { map } from 'rxjs/operators';

describe('translation engine', function () {
  it('translate by google', () => {
    return translateByAutoML('Here are the code files discussed on this page (all in the <code>src/app/</code> folder).')
      .pipe(map(text => expect(text).eql('这是本页讨论的代码文件（都在<code>src/app/</code>文件夹中）。')))
      .toPromise();
  });
  it('translate by ms', () => {
    return translateByMsTranslator('Here are the code files discussed on this page (all in the <code>src/app/</code> folder).')
      .pipe(map(text => expect(text).eql('下面是本页中讨论过的代码文件 (全部位于这个 <code>src/app/</code> 目录中)。')))
      .toPromise();
  });
});
