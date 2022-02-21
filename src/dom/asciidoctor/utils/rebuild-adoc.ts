import { AdocBuilder } from '../adoc-builder/adoc-builder';

export function rebuildAdoc(content: string): string {
  const builder = new AdocBuilder();
  const dom = builder.parse(content);
  return builder.build(dom);
}
