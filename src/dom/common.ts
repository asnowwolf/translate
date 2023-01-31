export function containsChinese(text?: string): boolean {
  text = text?.toString();
  if (!text) {
    return false;
  }
  return /\p{Script=Han}/gu.test(text);
}
