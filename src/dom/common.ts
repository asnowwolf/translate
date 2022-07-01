import { basename, extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';

export function containsChinese(text?: string): boolean {
  text = text?.toString();
  if (!text) {
    return false;
  }
  return text.search(/[\u4e00-\u9fa5]/gm) !== -1;
}

export function basenameWithoutExt(filename = ''): string {
  return basename(filename, extname(filename));
}

export function ensureHomeDir() {
  const homeDir = join(homedir(), `.ng-translator`);
  if (!existsSync(homeDir)) {
    mkdirSync(homeDir);
  }
  return homeDir;
}
