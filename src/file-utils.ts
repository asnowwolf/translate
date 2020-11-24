import { VFile } from 'vfile';
import * as toVFile from 'to-vfile';
import { extname, join } from 'path';
import { sync as globby } from 'globby';
import { JSDOM } from 'jsdom';

export function listFiles(globPattern: string): string[] {
  if (globPattern.indexOf('*') === -1 && extname(globPattern) === '.') {
    globPattern = join(globPattern, '**/*.html');
  }
  return globby(globPattern);
}

export function read(path: string, charset = 'utf-8'): VFile {
  return toVFile.readSync(path, charset);
}

export function write(file: VFile, contents: string): void {
  file.contents = contents;
  toVFile.writeSync(file);
}

export function parse(file: VFile): JSDOM {
  return new JSDOM(file.contents);
}

export function stringify(dom: JSDOM): string {
  return dom.serialize();
}
