import { DocumentRenderer } from './renderers/document-renderer';
import { SectionRenderer } from './renderers/section-renderer';
import { ParagraphRenderer } from './renderers/paragraph-renderer';
import { InlineAnchorRenderer } from './renderers/inline-anchor-renderer';
import { FallbackRenderer } from './renderers/fallback-renderer';
import { ListItemRenderer } from './renderers/list-item-renderer';
import { ListRenderer } from './renderers/list-renderer';
import { PageBreakRenderer } from './renderers/page-break-renderer';
import { ThematicBreakRenderer } from './renderers/thematic-break-renderer';
import { InlineIndextermRenderer } from './renderers/inline-indexterm-renderer';
import { DescriptionListRenderer } from './renderers/description-list-renderer';
import { NodeRenderer } from './renderers/base-node-renderer';
import { AdocNode } from './renderers/adoc-node';
import { InlineQuotedRenderer } from './renderers/inline-quoted-renderer';
import { InlineFootnoteRenderer } from './renderers/inline-footnote-renderer';
import { BlockImageRenderer } from './renderers/block-image-renderer';
import { InlineImageRenderer } from './renderers/inline-image-renderer';

export class AdocConverter {
  renderers: Record<string, NodeRenderer<AdocNode>> = {
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
    'image': new BlockImageRenderer(),
    'inline_quoted': new InlineQuotedRenderer(),
    'inline_anchor': new InlineAnchorRenderer(),
    'inline_footnote': new InlineFootnoteRenderer(),
    'inline_indexterm': new InlineIndextermRenderer(),
    'inline_image': new InlineImageRenderer(),
  };
  fallbackRenderer = new FallbackRenderer();

  convert(node: AdocNode, transform?: string): string {
    const nodeName = transform ?? node.getNodeName();
    const renderer = this.renderers[nodeName] ?? this.fallbackRenderer;

    return renderer.render(node);
  }
}
