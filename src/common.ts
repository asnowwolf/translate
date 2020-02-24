export enum TranslationEngineType {
  google = 'google',
  ms = 'ms',
  dict = 'dict',
  fake = 'fake',
}

export function containsChinese(text?: string): boolean {
  if (!text) {
    return false;
  }
  return text.search(/[\u4e00-\u9fa5]/gm) !== -1;
}
