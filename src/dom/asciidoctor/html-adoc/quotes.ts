import { DomElement } from '../../parse5/dom-models';

const quotes = [
  { type: 'strong', tag: 'strong', char: '*' },
  { type: 'emphasis', tag: 'em', char: '_' },
  { type: 'monospaced', tag: 'code', char: '`' },
  { type: 'mark', tag: 'mark', char: '#' },
  { type: 'superscript', tag: 'sup', char: '^' },
  { type: 'subscript', tag: 'sub', char: '~' },
  { type: 'asciimath', tag: 'code', char: '' },
];

export function quoteTagToChar(node: DomElement): string {
  if (node.hasAttribute('class')) {
    return;
  }
  return quotes.find(it => it.tag === node.tagName.toLowerCase())?.char;
}

export function quoteTypeToChar(node: DomElement): string {
  return quotes.find(it => it.type === node.getAttribute('prop-type').toLowerCase())?.char;
}

export function quoteCharToTag(char: string): string {
  return quotes.find(it => it.char === char)?.tag;
}

export function quoteTypeToTag(type: string): string {
  return quotes.find(it => it.type === type)?.tag;
}
