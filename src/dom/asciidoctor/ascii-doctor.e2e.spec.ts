import * as globby from 'globby';
import { readFileSync } from 'fs';
import { rebuildAdoc } from './utils/rebuild-adoc';

describe('ascii-doctor-e2e', () => {
  const files = globby.sync('./src/utils/asciidoctor/examples/**/*.adoc');

  files.forEach((file) => {
    it(`${file.replace(/^.\/src\/utils\/asciidoctor\/examples\//, '')}`, () => {
      const content = readFileSync(file, 'utf8').trim();
      const rebuilt = rebuildAdoc(content);
      expect(rebuilt).toEqual(content);
      expect(rebuildAdoc(rebuilt)).toEqual(rebuilt);
    });
  });
});
