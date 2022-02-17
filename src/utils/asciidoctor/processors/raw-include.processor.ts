import { DocumentNode, Reader } from '../adoc-converter/renderers/dom/models';

interface IncludeProcessor {
  handles(callback: (target: string) => boolean): void;

  process(block: (doc: DocumentNode, reader: Reader, target: string, attrs: any) => any): void;
}

export function RawIncludeProcessor(this: IncludeProcessor) {
  this.handles(() => true);
  this.process((doc, reader, target, attrs) => {
    const content = [`\\include::${target}[]`];
    return reader.pushInclude(content, target, target, 1, attrs);
  });
}
