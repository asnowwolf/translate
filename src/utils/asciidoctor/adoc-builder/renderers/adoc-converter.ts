import { DocumentRenderer } from './document-renderer';
import { SectionRenderer } from './section-renderer';
import { ParagraphRenderer } from './paragraph-renderer';
import { InlineAnchorRenderer } from './inline-anchor-renderer';
import { FallbackRenderer } from './fallback-renderer';
import { ListItemRenderer } from './list-item-renderer';
import { ListRenderer } from './list-renderer';
import { PageBreakRenderer } from './page-break-renderer';
import { ThematicBreakRenderer } from './thematic-break-renderer';
import { InlineIndexTermRenderer } from './inline-index-term-renderer';
import { DescriptionListRenderer } from './description-list-renderer';
import { NodeRenderer } from './base-node-renderer';
import { InlineQuotedRenderer } from './inline-quoted-renderer';
import { InlineFootnoteRenderer } from './inline-footnote-renderer';
import { BlockResourceRenderer } from './block-resource-renderer';
import { InlineResourceRenderer } from './inline-resource-renderer';
import { audioInlineableAttributes, imageInlineableAttributes, videoInlineableAttributes } from './utils/inlineable-attributes';
import { InlineKbdRenderer } from './inline-kbd-renderer';
import { InlineButtonRenderer } from './inline-button-renderer';
import { InlineMenuRenderer } from './inline-menu-renderer';
import { AdmonitionRenderer } from './admonition-renderer';
import { SidebarRenderer } from './sidebar-renderer';
import { ExampleRenderer } from './example-renderer';
import { BlockQuoteRenderer } from './block-quote-renderer';
import { VerseRenderer } from './verse-renderer';
import { SourceCodeRenderer } from './source-code-renderer';
import { CalloutListRenderer } from './callout-list-renderer';
import { InlineCalloutRenderer } from './inline-callout-renderer';
import { TableRenderer } from './table-renderer';
import { StemRenderer } from './stem-renderer';
import { OpenRenderer } from './open-renderer';
import { PreambleRenderer } from './preamble-renderer';
import { AbstractNode } from '../dom/abstract-node';
import { DocumentNode } from '../dom/document-node';

export class AdocConverter {
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
    'verse': new VerseRenderer(),
    'listing': new SourceCodeRenderer(),
    'literal': new SourceCodeRenderer(),
    'colist': new CalloutListRenderer(),
    'table': new TableRenderer(),
    'stem': new StemRenderer(),
    'open': new OpenRenderer(),
    'preamble': new PreambleRenderer(),
    'inline_quoted': new InlineQuotedRenderer(),
    'inline_anchor': new InlineAnchorRenderer(),
    'inline_footnote': new InlineFootnoteRenderer(),
    'inline_indexterm': new InlineIndexTermRenderer(),
    'inline_image': new InlineResourceRenderer(),
    'inline_kbd': new InlineKbdRenderer(),
    'inline_button': new InlineButtonRenderer(),
    'inline_menu': new InlineMenuRenderer(),
    'inline_callout': new InlineCalloutRenderer(),
    'outline': new FallbackRenderer(),
    'floating-title': new FallbackRenderer(),
    'toc': new FallbackRenderer(),
    'inline_break': new FallbackRenderer(),
  };
  fallbackRenderer = new FallbackRenderer();

  convert(node: DocumentNode, transform?: string): string {
    const nodeName = transform ?? node.getNodeName();
    const renderer = this.renderers[nodeName] ?? this.fallbackRenderer;

    return renderer.render(node);
  }
}

