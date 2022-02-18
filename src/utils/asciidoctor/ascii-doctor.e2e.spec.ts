import * as globby from 'globby';
import { readFileSync } from 'fs';
import { rebuildAdoc } from './utils/rebuild-adoc';

describe('ascii-doctor-e2e', () => {
  const files = globby.sync('./src/utils/asciidoctor/examples/**/*.adoc');

  function normalize(content: string): string {
    return content
      .replace(/\n+/g, '\n')
      .replace(/, /g, ',')
      .replace(/subs="(\w+)"/g, 'subs=$1')
      .replace(/[|] +/g, '|')
      .trim();
  }

  files.forEach((file) => {
    it(`${file}`, () => {
      const content = readFileSync(file, 'utf8');
      const rebuilt = rebuildAdoc(content);
      expect(normalize(rebuilt)).toEqual(normalize(content));
      expect(normalize(rebuildAdoc(rebuilt))).toEqual(normalize(rebuilt));
    });
  });
});
