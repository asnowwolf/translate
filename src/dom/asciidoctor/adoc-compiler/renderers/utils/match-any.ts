export function matchAny(name: string, valueOrPatterns: (string | RegExp)[]): boolean {
  return valueOrPatterns.some(valueOrPattern => {
    if (typeof valueOrPattern === 'string') {
      return name === valueOrPattern;
    } else {
      return valueOrPattern.test(name);
    }
  });
}
