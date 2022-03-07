import { Asciidoctor } from '@asciidoctor/core';
import { DomDocument, DomDocumentFragment, DomElement, DomNode, DomText } from '../../parse5/dom-models';
import { createAsciidoctor } from '../utils/create-asciidoctor';
import { addQuotes } from '../adoc-builder/renderers/utils/add-quotes';
import { quoteTagToChar } from './quotes';
import { SpecialChars } from './special-chars';

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

function inlineHtmlToAdoc(node: DomElement): string {
  return node.childNodes.map(node => {
    if (node instanceof DomText) {
      return SpecialChars.decodeText(node.textContent);
    } else if (node instanceof DomElement) {
      const quoteChar = quoteTagToChar(node.tagName.toLowerCase())?.repeat(isUnconstrained(node) ? 2 : 1);
      if (quoteChar) {
        return [quoteChar, inlineHtmlToAdoc(node), quoteChar].join('');
      }
      if (node.isTagOf('a') && !node.hasAttribute('class')) {
        const href = node.getAttribute('href');
        const text = inlineHtmlToAdoc(node).replace(/^\[(.*?)]/g, '$1');
        if (!href.startsWith('#')) {
          return `xref:${href.replace(/\.html#/, '.adoc#')}[${text}]`;
        }
        const noHashHref = href.replace(/^#/, '');
        if (noHashHref === text) {
          return `<<${text}>>`;
        } else {
          return `<<${[noHashHref, text].filter(it => !!it).join(',')}>>`;
        }
      }
      if (node.isTagOf('br')) {
        return ` +`;
      }
      if (node.isTagOf('b')) {
        if (node.hasClass('button')) {
          return `btn:[${inlineHtmlToAdoc(node)}]`;
        }
        if (node.hasClass('menu', 'submenu', 'menuitem')) {
          return inlineHtmlToAdoc(node);
        }
      }
      if (node.isTagOf('span')) {
        if (node.hasClass('menuseg')) {
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
    }
  }).join('');
}

// 因为用于翻译用途，所以目前只处理内联的语句
export function htmlDomToAdoc(htmlDoc: DomDocumentFragment | DomDocument): Asciidoctor.Document {
  const adoc = createAsciidoctor();
  const root = adoc.load('', { backend: 'adoc' });
  const paragraph = adoc.Block.create(root, 'paragraph', {});
  paragraph.lines = inlineHtmlToAdoc(htmlDoc.querySelector(it => it.isTagOf('p'))).split('\n');
  root.blocks.push(paragraph);
  return root;
}

export function htmlToAdoc(html: string): string {
  return htmlDomToAdoc(DomDocument.parse(html)).convert({ backend: 'adoc' }).trim();
}
