import { BaseTinyNodeRenderer } from './base-tiny-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';

export class TinyDocumentRenderer extends BaseTinyNodeRenderer<Asciidoctor.Document> {
  protected readonly tagName = 'article';
}
