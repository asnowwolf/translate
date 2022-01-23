export function sameExceptWhitespace(s1: string, s2: string): boolean {
  return s1.replace(/\s/g, '') === s2.replace(/\s/g, '');
}
