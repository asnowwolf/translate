import { AdocCompiler } from '../adoc-compiler';

export function rebuildAdoc(content: string): string {
  const compiler = new AdocCompiler();
  const dom = compiler.parse(content);
  return compiler.build(dom);
}
