import { VFile } from 'vfile';
import * as toVFile from 'to-vfile';
import { extname, join } from 'path';
import { sync as globby } from 'globby';

export function listFiles(globPattern: string): string[] {
  if (globPattern.indexOf('*') === -1 && extname(globPattern) === '.') {
    globPattern = join(globPattern, '**/*.html');
  }
  return globby(globPattern);
}

export function read(charset = 'utf-8'): (path: string) => VFile {
  return (path) => toVFile.readSync(path, charset);
}

export function write(file: VFile): (contents: string) => void {
  return (contents) => {
    file.contents = contents;
    toVFile.writeSync(file);
  };
}
