import { DocumentRenderer } from './renderers/document-renderer';
import { SectionRenderer } from './renderers/section-renderer';
import { ParagraphRenderer } from './renderers/paragraph-renderer';
import { InlineAnchorRenderer } from './renderers/inline-anchor-renderer';
import { FallbackRenderer } from './renderers/fallback-renderer';
import { ListItemRenderer } from './renderers/list-item-renderer';
import { ListRenderer } from './renderers/list-renderer';
import { PageBreakRenderer } from './renderers/page-break-renderer';
import { ThematicBreakRenderer } from './renderers/thematic-break-renderer';
import { InlineIndexTermRenderer } from './renderers/inline-index-term-renderer';
import { DescriptionListRenderer } from './renderers/description-list-renderer';
import { NodeRenderer } from './renderers/base-node-renderer';
import { InlineQuotedRenderer } from './renderers/inline-quoted-renderer';
import { InlineFootnoteRenderer } from './renderers/inline-footnote-renderer';
import { BlockResourceRenderer } from './renderers/block-resource-renderer';
import { InlineResourceRenderer } from './renderers/inline-resource-renderer';
import { audioInlineableAttributes, imageInlineableAttributes, videoInlineableAttributes } from './renderers/utils/inlineable-attributes';
import { InlineKbdRenderer } from './renderers/inline-kbd-renderer';
import { InlineButtonRenderer } from './renderers/inline-button-renderer';
import { InlineMenuRenderer } from './renderers/inline-menu-renderer';
import { AdmonitionRenderer } from './renderers/admonition-renderer';
import { SidebarRenderer } from './renderers/sidebar-renderer';
import { ExampleRenderer } from './renderers/example-renderer';
import { BlockQuoteRenderer } from './renderers/block-quote-renderer';
import { VerseRenderer } from './renderers/verse-renderer';
import { SourceCodeRenderer } from './renderers/source-code-renderer';
import { CalloutListRenderer } from './renderers/callout-list-renderer';
import { InlineCalloutRenderer } from './renderers/inline-callout-renderer';
import { TableRenderer } from './renderers/table-renderer';
import { StemRenderer } from './renderers/stem-renderer';
import { OpenRenderer } from './renderers/open-renderer';
import { AbstractNode, DocumentNode } from './renderers/dom/models';

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
    'inline_quoted': new InlineQuotedRenderer(),
    'inline_anchor': new InlineAnchorRenderer(),
    'inline_footnote': new InlineFootnoteRenderer(),
    'inline_indexterm': new InlineIndexTermRenderer(),
    'inline_image': new InlineResourceRenderer(),
    'inline_kbd': new InlineKbdRenderer(),
    'inline_button': new InlineButtonRenderer(),
    'inline_menu': new InlineMenuRenderer(),
    'inline_callout': new InlineCalloutRenderer(),
  };
  fallbackRenderer = new FallbackRenderer();

  convert(node: DocumentNode, transform?: string): string {
    const nodeName = transform ?? node.getNodeName();
    const renderer = this.renderers[nodeName] ?? this.fallbackRenderer;

    return renderer.render(node);
  }
}

