import { basename, extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';

export enum TranslationEngineType {
  google = 'google',
  gcloud = 'gcloud',
  ms = 'ms',
  dict = 'dict',
  fake = 'fake',
  noop = 'noop',
}

export function containsChinese(text?: string): boolean {
  if (!text) {
    return false;
  }
  return text.search(/[\u4e00-\u9fa5]/gm) !== -1;
}

export function basenameWithoutExt(filename: string): string {
  return basename(filename, extname(filename));
}

export function ensureHomeDir() {
  const homeDir = join(homedir(), `.ng-translator`);
  if (!existsSync(homeDir)) {
    mkdirSync(homeDir);
  }
  return homeDir;
}
