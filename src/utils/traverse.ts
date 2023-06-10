import {readdirSync} from 'fs';
import {join} from 'path';

export function* traverse(root: string): Generator<string> {
  const files = readdirSync(root, {withFileTypes: true});
  for (const file of files) {
    const fullPath = join(root, file.name);
    if (file.isDirectory()) {
      yield* traverse(fullPath);
    } else {
      yield fullPath;
    }
  }
}
