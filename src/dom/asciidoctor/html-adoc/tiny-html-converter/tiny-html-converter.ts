import { Asciidoctor } from '@asciidoctor/core';
import { AbstractNode, AdocNodeRendererMap } from '../../utils/adoc-node-renderer';
import { TinyFallbackRenderer } from './tiny-fallback-renderer';
import { TinyDocumentRenderer } from './tiny-document-renderer';
import { TinySectionRenderer } from './tiny-section-renderer';
import { TinyParagraphRenderer } from './tiny-paragraph-renderer';
import { TinyOutlineRenderer } from './tiny-outline-renderer';
import { TinyAdmonitionRenderer } from './tiny-admonition-renderer';
import { TinyAudioRenderer } from './tiny-audio-renderer';
import { TinyColistRenderer } from './tiny-colist-renderer';
import { TinyDlistRenderer } from './tiny-dlist-renderer';
import { TinyExampleRenderer } from './tiny-example-renderer';
import { TinyFloatingTitleRenderer } from './tiny-floating-title-renderer';
import { TinyImageRenderer } from './tiny-image-renderer';
import { TinyListingRenderer } from './tiny-listing-renderer';
import { TinyLiteralRenderer } from './tiny-literal-renderer';
import { TinyStemRenderer } from './tiny-stem-renderer';
import { TinyOlistRenderer } from './tiny-olist-renderer';
import { TinyOpenRenderer } from './tiny-open-renderer';
import { TinyPageBreakRenderer } from './tiny-page-break-renderer';
import { TinyPreambleRenderer } from './tiny-preamble-renderer';
import { TinyQuoteRenderer } from './tiny-quote-renderer';
import { TinyThematicBreakRenderer } from './tiny-thematic-break-renderer';
import { TinySidebarRenderer } from './tiny-sidebar-renderer';
import { TinyTableRenderer } from './tiny-table-renderer';
import { TinyTocRenderer } from './tiny-toc-renderer';
import { TinyUlistRenderer } from './tiny-ulist-renderer';
import { TinyVerseRenderer } from './tiny-verse-renderer';
import { TinyVideoRenderer } from './tiny-video-renderer';
import { TinyInlineAnchorRenderer } from './tiny-inline-anchor-renderer';
import { TinyInlineBreakRenderer } from './tiny-inline-break-renderer';
import { TinyInlineButtonRenderer } from './tiny-inline-button-renderer';
import { TinyInlineCalloutRenderer } from './tiny-inline-callout-renderer';
import { TinyInlineFootnoteRenderer } from './tiny-inline-footnote-renderer';
import { TinyInlineImageRenderer } from './tiny-inline-image-renderer';
import { TinyInlineIndextermRenderer } from './tiny-inline-indexterm-renderer';
import { TinyInlineKbdRenderer } from './tiny-inline-kbd-renderer';
import { TinyInlineMenuRenderer } from './tiny-inline-menu-renderer';
import { TinyInlineQuotedRenderer } from './tiny-inline-quoted-renderer';
import { TinyListItemRenderer } from './tiny-list-item-renderer';

/**
 * 一个精简的 HTML 转换器，为的是生成便于翻译和转回 adoc 的 HTML 格式，这个格式尽可能和 markdown 生成的 HTML 相似，以便作为中间码与 markdown 互转。
 *
 * 公共属性：adoc-node=node.getNodeName()
 */
export class TinyHtmlConverter implements Asciidoctor.AbstractConverter {
  renderers: AdocNodeRendererMap = {
    'document': new TinyDocumentRenderer(),
    'embedded': new TinyDocumentRenderer(),
    'outline': new TinyOutlineRenderer(),
    'section': new TinySectionRenderer(),
    'admonition': new TinyAdmonitionRenderer(),
    'audio': new TinyAudioRenderer(),
    'colist': new TinyColistRenderer(),
    'dlist': new TinyDlistRenderer(),
    'example': new TinyExampleRenderer(),
    'floating_title': new TinyFloatingTitleRenderer(),
    'image': new TinyImageRenderer(),
    'listing': new TinyListingRenderer(),
    'list_item': new TinyListItemRenderer(),
    'literal': new TinyLiteralRenderer(),
    'stem': new TinyStemRenderer(),
    'olist': new TinyOlistRenderer(),
    'open': new TinyOpenRenderer(),
    'page_break': new TinyPageBreakRenderer(),
    'paragraph': new TinyParagraphRenderer(),
    'preamble': new TinyPreambleRenderer(),
    'quote': new TinyQuoteRenderer(),
    'thematic_break': new TinyThematicBreakRenderer(),
    'sidebar': new TinySidebarRenderer(),
    'table': new TinyTableRenderer(),
    'toc': new TinyTocRenderer(),
    'ulist': new TinyUlistRenderer(),
    'verse': new TinyVerseRenderer(),
    'video': new TinyVideoRenderer(),
    'inline_anchor': new TinyInlineAnchorRenderer(),
    'inline_break': new TinyInlineBreakRenderer(),
    'inline_button': new TinyInlineButtonRenderer(),
    'inline_callout': new TinyInlineCalloutRenderer(),
    'inline_footnote': new TinyInlineFootnoteRenderer(),
    'inline_image': new TinyInlineImageRenderer(),
    'inline_indexterm': new TinyInlineIndextermRenderer(),
    'inline_kbd': new TinyInlineKbdRenderer(),
    'inline_menu': new TinyInlineMenuRenderer(),
    'inline_quoted': new TinyInlineQuotedRenderer(),
  };
  fallbackRenderer = new TinyFallbackRenderer();

  convert(node: AbstractNode, transform?: string): string {
    const nodeName = transform ?? node.getNodeName();
    const renderer = this.renderers[nodeName] ?? this.fallbackRenderer;

    return renderer.render(node).replace(/>\n+</g, '><');
  }
}
