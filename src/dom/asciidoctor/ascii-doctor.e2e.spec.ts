import * as globby from 'globby';
import { readFileSync } from 'fs';
import { AdocBuilder } from './adoc-builder/adoc-builder';

function rebuild(content: string): string {
  const compiler = new AdocBuilder();
  const dom = compiler.parse(content);
  return compiler.build(dom);
}

describe('ascii-doctor-e2e', () => {
  const files = globby.sync('./src/dom/asciidoctor/examples/**/*.adoc');

  files.forEach((file) => {
    it(`${file.replace(/^.\/src\/dom\/asciidoctor\/examples\//, '')}`, () => {
      const content = readFileSync(file, 'utf8').trim();
      const rebuilt = rebuild(content);
      expect(rebuilt).toEqual(content);
      expect(rebuild(rebuilt)).toEqual(rebuilt);
    });
  });
});
