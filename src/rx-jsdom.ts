import { VFile } from 'vfile';
import { JSDOM } from 'jsdom';

export function parse(): (file: VFile) => JSDOM {
  return (file) => new JSDOM(file.contents);
}

export function stringify(): (JSDOM) => string {
  return (dom) => dom.serialize();
}
