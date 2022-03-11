import { Asciidoctor } from '@asciidoctor/core';
import { DomDocument, DomDocumentFragment, DomElement, DomNode, DomText } from '../../parse5/dom-models';
import { createAsciidoctor } from '../utils/create-asciidoctor';
import { addQuotes } from '../adoc-builder/renderers/utils/add-quotes';
import { quoteTagToChar } from './quotes';
import { SpecialChars } from './special-chars';
import { simpleEmailPattern, urlSchemaPattern } from './url-patterns';

function prevCharOf(node: DomNode): string {
  if (!node) {
    return;
  }
  if (node instanceof DomText) {
    const text = node.textContent || prevCharOf(node.previousSibling());
    return text?.slice(-1);
  } else {
    return prevCharOf(node.previousSibling());
  }
}

function nextCharOf(node: DomNode): string {
  if (!node) {
    return;
  }
  if (node instanceof DomText) {
    const text = node.textContent || nextCharOf(node.nextSibling());
    return text?.slice(-1);
  } else {
    return nextCharOf(node.nextSibling());
  }
}

function isUnconstrained(node: DomNode): boolean {
  return /^\w$/.test(prevCharOf(node)) || /^\w$/.test(nextCharOf(node));
}

function escapeUrl(text: string): string {
  return text.replace(urlSchemaPattern, '\\$1:')
    .replace(simpleEmailPattern, '\\$1@$2');
}

function handleTagA(node: DomElement) {
  const urlPattern = /^(mailto:|https?:\/\/)/;
  const href = node.getAttribute('href');
  const text = inlineHtmlToAdoc(node).replace(/^\[(.*?)]/g, '$1');
  const suffix = node.getAttribute('target') === '_blank' ? '^' : '';
  const quotedText = addQuotes(text + suffix);
  if (!node.hasAttribute('class')) {
    const noHashHref = href.replace(/^#/, '').replace(/\.html#/, '.adoc#').replace(urlPattern, '');
    if (noHashHref === text) {
      if (href.startsWith('mailto:')) {
        return quotedText;
      } else {
        return `<<${quotedText}>>`;
      }
    } else {
      return `<<${[noHashHref, quotedText].filter(it => !!it).join(',')}>>`;
    }
  } else if (node.hasClass('bare')) {
    return quotedText;
  } else {
    return `${href}[${quotedText}, role=${node.getAttribute('class')}]`;
  }
}

function handleTagBr(node: DomElement): string {
  return ` +`;
}

function handleTagSpan(node: DomElement) {
  if (node.hasClass('menuseq')) {
    const segments = node.querySelectorAll(it => it.isTagOf('b') && it.hasClass('menu', 'submenu', 'menuitem'))
      .map(it => inlineHtmlToAdoc(it));
    return `menu:${segments[0]}[${segments.slice(1).join(' > ')}]`;
  } else if (node.hasClass('keyseq')) {
    const keys = node.querySelectorAll(it => it.isTagOf('kbd')).map(it => inlineHtmlToAdoc(it));
    return `kbd:[${keys.join('+')}]`;
  } else if (node.hasClass('image')) {
    const img = node.querySelector(it => it.isTagOf('img')) as DomElement;
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    const width = img.getAttribute('width');
    const height = img.getAttribute('height');
    const attributes = img.getAttributes().filter(it => !['src', 'alt', 'width', 'height'].includes(it.name))
      .map(it => `${SpecialChars.encodeAttribute(it.name)}=${addQuotes(SpecialChars.encodeAttribute(it.value))}`).join(' ');
    const content = [addQuotes(SpecialChars.decodeAttribute(alt)), width, height, attributes].filter(it => !!it).join(',');
    return `image:${src}[${content}]`;
  } else if (node.hasClass('icon')) {
    const icon = node.querySelector(it => it.isTagOf('a') && it.hasClass('image'));
    const src = icon.getAttribute('href');
    const target = icon.getAttribute('target');
    const alt = inlineHtmlToAdoc(icon).replace(/^\[(.*?)]$/g, '$1');
    if (target) {
      return `icon:${alt}[link=${addQuotes(src)},window=${target}]`;
    } else {
      return `icon:${alt}[link=${addQuotes(src)}]`;
    }
  } else {
    return `[.${node.getAttribute('class')}]#${inlineHtmlToAdoc(node)}#`;
  }
}

function handleTagB(node: DomElement): string {
  if (node.hasClass('button')) {
    return `btn:[${inlineHtmlToAdoc(node)}]`;
  } else if (node.hasClass('menu', 'submenu', 'menuitem')) {
    return inlineHtmlToAdoc(node);
  }
}

function handleTagSup(node: DomElement): string {
  if (node.hasClass('footnote')) {
    const id = node.getAttribute('id')?.replace(/^_footnote_/, '') || '';
    return `footnote:${id}[${inlineHtmlToAdoc(node.querySelector(it => it.isTagOf('a')))}]`;
  } else if (node.hasClass('footnoteref')) {

  }
}

function inlineHtmlToAdoc(node: DomElement): string {
  if (!node) {
    return '';
  }
  return node.childNodes.map(child => {
    if (child instanceof DomText) {
      const escapedText = child.queryAncestor(it => it.isTagOf('a')) ? child.textContent : escapeUrl(child.textContent);
      return SpecialChars.decodeText(escapedText.replace(/\\[$](.*?)\\[$]/g, 'stem:[$1]'));
    } else if (child instanceof DomElement) {
      const quoteChar = quoteTagToChar(child)?.repeat(isUnconstrained(child) ? 2 : 1);
      if (quoteChar) {
        return [quoteChar, inlineHtmlToAdoc(child), quoteChar].join('');
      }
      const tagName = child.tagName.toLowerCase();
      switch (tagName) {
        case 'a':
          return handleTagA(child);
        case 'br':
          return handleTagBr(child);
        case 'b':
          return handleTagB(child);
        case 'span':
          return handleTagSpan(child);
        case 'sup':
          return handleTagSup(child);
      }
    }
  }).join('');
}

function adocDecompile(adoc: Asciidoctor, root: Asciidoctor.Document, htmlDoc: DomDocumentFragment | DomDocument) {
  const paragraph = adoc.Block.create(root, 'paragraph', {});
  paragraph.lines = inlineHtmlToAdoc(htmlDoc.querySelector(it => it.isTagOf('p'))).split('\n');
  root.blocks.push(paragraph);
}

export function htmlDomToAdoc(htmlDoc: DomDocumentFragment | DomDocument): Asciidoctor.Document {
  const adoc = createAsciidoctor();
  const root = adoc.load('', { backend: 'adoc' });
  adocDecompile(adoc, root, htmlDoc);
  return root;
}

export function htmlToAdoc(html: string): string {
  return htmlDomToAdoc(DomDocument.parse(html)).convert({ backend: 'adoc' }).trim();
}
