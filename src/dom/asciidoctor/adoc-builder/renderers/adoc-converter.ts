import { DocumentRenderer } from './document-renderer';
import { SectionRenderer } from './section-renderer';
import { ParagraphRenderer } from './paragraph-renderer';
import { FallbackRenderer } from './fallback-renderer';
import { ListItemRenderer } from './list-item-renderer';
import { ListRenderer } from './list-renderer';
import { PageBreakRenderer } from './page-break-renderer';
import { ThematicBreakRenderer } from './thematic-break-renderer';
import { DescriptionListRenderer } from './description-list-renderer';
import { NodeRenderer } from './base-node-renderer';
import { BlockResourceRenderer } from './block-resource-renderer';
import { audioInlineableAttributes, imageInlineableAttributes, videoInlineableAttributes } from './utils/inlineable-attributes';
import { AdmonitionRenderer } from './admonition-renderer';
import { SidebarRenderer } from './sidebar-renderer';
import { ExampleRenderer } from './example-renderer';
import { BlockQuoteRenderer } from './block-quote-renderer';
import { SourceCodeRenderer } from './source-code-renderer';
import { CalloutListRenderer } from './callout-list-renderer';
import { TableRenderer } from './table-renderer';
import { StemRenderer } from './stem-renderer';
import { OpenRenderer } from './open-renderer';
import { PreambleRenderer } from './preamble-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractNode = Asciidoctor.AbstractNode;

export class AdocConverter implements Asciidoctor.AbstractConverter {
  renderers: Record<string, NodeRenderer<AbstractNode>> = {
    'document': new DocumentRenderer(),
    'embedded': new DocumentRenderer(),
    'section': new SectionRenderer(),
    'ulist': new ListRenderer(),
    'olist': new ListRenderer(),
    'dlist': new DescriptionListRenderer(),
    'list_item': new ListItemRenderer(),
    'thematic_break': new ThematicBreakRenderer(),
    'page_break': new PageBreakRenderer(),
    'paragraph': new ParagraphRenderer(),
    'image': new BlockResourceRenderer('image', imageInlineableAttributes),
    'audio': new BlockResourceRenderer('audio', audioInlineableAttributes),
    'video': new BlockResourceRenderer('video', videoInlineableAttributes),
    'admonition': new AdmonitionRenderer(),
    'sidebar': new SidebarRenderer(),
    'example': new ExampleRenderer(),
    'quote': new BlockQuoteRenderer(),
    'verse': new BlockQuoteRenderer(),
    'listing': new SourceCodeRenderer(),
    'literal': new SourceCodeRenderer(),
    'colist': new CalloutListRenderer(),
    'table': new TableRenderer(),
    'stem': new StemRenderer(),
    'open': new OpenRenderer(),
    'preamble': new PreambleRenderer(),
    // 'outline': new FallbackRenderer(),
    'floating_title': new SectionRenderer(),
    // 'toc': new FallbackRenderer(),
  };
  fallbackRenderer = new FallbackRenderer();

  convert(node: AbstractNode, transform?: string): string {
    const nodeName = transform ?? node.getNodeName();
    const renderer = this.renderers[nodeName] ?? this.fallbackRenderer;

    return renderer.render(node);
  }
}

