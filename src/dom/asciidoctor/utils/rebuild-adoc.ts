import { AdocBuilder } from '../adoc-builder/adoc-builder';

export function rebuildAdoc(content: string): string {
  const compiler = new AdocBuilder();
  const dom = compiler.parse(content);
  return compiler.build(dom);
}
