import { extname, join } from 'path';
import { sync as globby } from 'globby';

export function listFiles(globPattern: string): string[] {
  if (globPattern.indexOf('*') === -1 && extname(globPattern) === '.') {
    globPattern = join(globPattern, '**/*.html');
  }
  return globby(globPattern);
}
