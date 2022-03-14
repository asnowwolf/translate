export function matchSome(name: string, valueOrPatterns: readonly (string | RegExp)[]): boolean {
  return valueOrPatterns.some(valueOrPattern => {
    if (typeof valueOrPattern === 'string') {
      return name === valueOrPattern;
    } else {
      return valueOrPattern.test(name);
    }
  });
}
