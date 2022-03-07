const quotes = [
  { tag: 'strong', char: '*' },
  { tag: 'em', char: '_' },
  { tag: 'code', char: '`' },
  { tag: 'mark', char: '#' },
  { tag: 'sup', char: '^' },
  { tag: 'sub', char: '~' },
];

export function quoteTagToChar(tag: string): string {
  return quotes.find(it => it.tag === tag)?.char;
}

export function quoteCharToTag(char: string): string {
  return quotes.find(it => it.char === char)?.tag;
}
