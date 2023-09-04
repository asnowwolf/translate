import { join, parse, relative } from 'path';

export function getNewFilenameFor(translatingFilename: string, cwd: string, dictFolder: string, newExtension: string): string {
  const filename = cwd ? relative(cwd, translatingFilename) : translatingFilename;
  const parsed = parse(filename);
  return join(dictFolder, parsed.dir, parsed.name + newExtension);
}
