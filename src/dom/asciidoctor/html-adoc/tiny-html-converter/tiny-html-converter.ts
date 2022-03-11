import { Asciidoctor } from '@asciidoctor/core';
import { DomDocument, DomElement, DomNode } from '../../../parse5/dom-models';
import { AdocNodeTypes } from '../../utils/adoc-node-types';
import { typeToTag } from '../quotes';
import AbstractNode = Asciidoctor.AbstractNode;
import AbstractConverter = Asciidoctor.AbstractConverter;
import Section = Asciidoctor.Section;
import Block = Asciidoctor.Block;

export interface AdocNodeRenderer<T extends AbstractNode> {
  render(node: T): DomNode;
}

export type AdocNodeRendererMap = { [K in keyof AdocNodeTypes]?: AdocNodeRenderer<AdocNodeTypes[K]> };

class TinyFallbackRenderer implements AdocNodeRenderer<AbstractNode> {
  render(node: AbstractNode): DomNode {
    throw new Error(`Unknown node type: ${node.getNodeName()}`);
  }
}

class TinyDocumentRenderer implements AdocNodeRenderer<Asciidoctor.Document> {
  render(node: Asciidoctor.Document): DomNode {
    const dom = DomDocument.parse('<!doctype html><html><head></head><body></body></html>');
    dom.title = node.getTitle();
    dom.body.innerHTML = node.getContent();
    return dom;
  }
}

class TinySectionRenderer implements AdocNodeRenderer<Section> {
  render(node: Section): DomNode {
    const result = new DomElement('section', [{ name: 'title', value: node.getTitle() }]);
    result.innerHTML = node.getContent();
    return result;
  }
}

class TinyParagraphRenderer implements AdocNodeRenderer<Block> {
  render(node: Block): DomNode {
    const result = new DomElement('p');
    result.innerHTML = node.getContent();
    return result;
  }
}

class TinyOutlineRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyAdmonitionRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyAudioRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyColistRenderer implements AdocNodeRenderer<Asciidoctor.List> {
  render(node: Asciidoctor.List): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyDlistRenderer implements AdocNodeRenderer<Asciidoctor.List> {
  render(node: Asciidoctor.List): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyExampleRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyFloatingTitleRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyImageRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyListingRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyLiteralRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyStemRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyOlistRenderer implements AdocNodeRenderer<Asciidoctor.List> {
  render(node: Asciidoctor.List): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyOpenRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyPageBreakRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyPreambleRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyQuoteRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyThematicBreakRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinySidebarRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyTableRenderer implements AdocNodeRenderer<Asciidoctor.Table> {
  render(node: Asciidoctor.Table): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyTocRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyUlistRenderer implements AdocNodeRenderer<Asciidoctor.List> {
  render(node: Asciidoctor.List): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyVerseRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyVideoRenderer implements AdocNodeRenderer<Asciidoctor.Block> {
  render(node: Asciidoctor.Block): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineAnchorRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineBreakRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineButtonRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineCalloutRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineFootnoteRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineImageRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineIndextermRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineKbdRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineMenuRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement('');
    return result;
  }
}

class TinyInlineQuotedRenderer implements AdocNodeRenderer<Asciidoctor.Inline> {
  render(node: Asciidoctor.Inline): DomNode {
    const result = new DomElement(typeToTag(node.getType()));
    result.innerHTML = node.getText();
    return result;
  }
}

export class TinyHtmlConverter implements AbstractConverter {
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
    'floating-title': new TinyFloatingTitleRenderer(),
    'image': new TinyImageRenderer(),
    'listing': new TinyListingRenderer(),
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

    const result = renderer.render(node);
    if ('toHtml' in result) {
      return result.toHtml();
    } else {
      return result.outerHTML;
    }
  }
}
