import { DocumentNode } from '../dom/document-node';
import { Reader } from '../dom/reader';
import { addQuotes } from '../renderers/utils/add-quotes';

interface IncludeProcessor {
  handles(callback: (target: string) => boolean): void;

  process(block: (doc: DocumentNode, reader: Reader, target: string, attrs: any) => any): void;
}

export function RawIncludeProcessor(this: IncludeProcessor) {
  this.handles(() => true);
  this.process((doc, reader, target, attrs) => {
    const attrsText = attrs.lines ? `lines=${addQuotes(attrs.lines)}` : '';
    const content = [`\\include::${target}[${attrsText}]`];
    return reader.pushInclude(content, target, target, 1, attrs);
  });
}
