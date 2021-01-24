import { jsdoc } from './js-doc';
import { FakeTranslator } from './engine';
import { readFileSync } from 'fs';
import { JSDocTagStructure, OptionalKind, StructureKind } from 'ts-morph';

function createTag(tagName: string, text: string): OptionalKind<JSDocTagStructure> {
  return { kind: StructureKind.JSDocTag, tagName, leadingTrivia: '', trailingTrivia: '', text };
}

describe('TS Doc Translation', () => {
  it('translate ts file', async () => {
    const result = await jsdoc.translate(readFileSync('src/test/samples/ts/demo.ts', 'utf8'), new FakeTranslator());
    expect(result).toEqual(readFileSync('src/test/samples/ts/demo-translated.ts', 'utf8'));
  });
  it('split param tag with type and name', () => {
    const [, prefix, text] = jsdoc.splitTagText(createTag('param', '{OverlayConfig} config Configuration applied to the overlay.'));
    expect(prefix).toEqual('{OverlayConfig} config ');
    expect(text).toEqual('Configuration applied to the overlay.');
  });

  it('split param tag with name', () => {
    const [, prefix, text] = jsdoc.splitTagText(createTag('param', 'config Configuration applied to the overlay.'));
    expect(prefix).toEqual('config ');
    expect(text).toEqual('Configuration applied to the overlay.');
  });

  it('split param tag without name', () => {
    const parts = jsdoc.splitTagText(createTag('param', 'config'));
    expect(parts).toBeNull();
  });

  it('split returns tag with type and description', () => {
    const [, prefix, text] = jsdoc.splitTagText(createTag('returns', '{Overlay} Configuration applied to the overlay.'));
    expect(prefix).toEqual('{Overlay} ');
    expect(text).toEqual('Configuration applied to the overlay.');
  });
  it('split returns tag with description', () => {
    const [, , text] = jsdoc.splitTagText(createTag('returns', 'Configuration applied to the overlay.'));
    expect(text).toEqual('Configuration applied to the overlay.');
  });
  it('split returns tag without description', () => {
    const [, , text] = jsdoc.splitTagText(createTag('returns', ''));
    expect(text).toEqual('');
  });

  it('dont split other tags', () => {
    const [, prefix, text] = jsdoc.splitTagText(createTag('constructor', 'some text'));
    expect(prefix).toEqual('');
    expect(text).toEqual('some text');
  });
});
