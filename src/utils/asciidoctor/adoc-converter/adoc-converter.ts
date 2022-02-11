import { DocumentRenderer } from './renderers/document-renderer';
import { SectionRenderer } from './renderers/section-renderer';
import { ParagraphRenderer } from './renderers/paragraph-renderer';
import { InlineAnchorRenderer } from './renderers/inline-anchor-renderer';
import { FallbackRenderer } from './renderers/fallback-renderer';
import { AdocNode, NodeRenderer } from './renderers/block-node-renderer';
import { ListItemRenderer } from './renderers/list-item-renderer';
import { ListRenderer } from './renderers/list-renderer';
import { PageBreakRenderer } from './renderers/page-break-renderer';
import { ThematicBreakRenderer } from './renderers/thematic-break-renderer';
import { InlineIndextermRenderer } from './renderers/inline-indexterm-renderer';

export class AdocConverter {
  renderers: Record<string, NodeRenderer<AdocNode>> = {
    'document': new DocumentRenderer(),
    'embedded': new DocumentRenderer(),
    'section': new SectionRenderer(),
    'ulist': new ListRenderer(),
    'olist': new ListRenderer(),
    'dlist': new ListRenderer(),
    'list_item': new ListItemRenderer(),
    'thematic_break': new ThematicBreakRenderer(),
    'page_break': new PageBreakRenderer(),
    'paragraph': new ParagraphRenderer(),
    'inline_anchor': new InlineAnchorRenderer(),
    'inline_indexterm': new InlineIndextermRenderer(),
  };
  fallbackRenderer = new FallbackRenderer();

  convert(node: AdocNode, transform?: string): string {
    const nodeName = transform ?? node.getNodeName();
    const renderer = this.renderers[nodeName] ?? this.fallbackRenderer;

    return renderer.render(node);
  }
}
