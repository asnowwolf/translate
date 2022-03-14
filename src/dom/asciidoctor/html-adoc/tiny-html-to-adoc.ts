import { DomDocument, DomDocumentFragment, DomElement, DomNode, DomText } from '../../parse5/dom-models';
import { Asciidoctor } from '@asciidoctor/core';
import { createAsciidoctor } from '../utils/create-asciidoctor';
import { Adoc } from '../utils/adoc';
import { quoteTypeToChar } from './quotes';
import { addQuotes } from '../adoc-builder/renderers/utils/add-quotes';
import AbstractNode = Asciidoctor.AbstractNode;
import AbstractBlock = Asciidoctor.AbstractBlock;

function extractValue(value: any, type: string): any {
  if (type === 'object') {
    return JSON.parse(value);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return +value;
  } else {
    return value;
  }
}

function loadAttributes(domNode: DomElement, adocNode: Asciidoctor.AbstractNode) {
  const attributes = domNode.getAttributes();
  attributes.filter(it => it.name.startsWith('data-') && it.value !== undefined && it.value !== null)
    .forEach((attr) => {
      const type = domNode.getAttribute(`type-${attr.name}`);
      const name = attr.name.replace(/^data-/g, '');
      const value = extractValue(attr.value, type);
      // setAttribute 无法正确处理 number 类型的参数，因此要绕过它
      if (typeof value === 'number') {
        adocNode.attributes.$$smap[name] = value;
      } else {
        adocNode.setAttribute(name, value);
      }
    });
}

function createAdocNode(adoc: Asciidoctor, adocNode: Asciidoctor.AbstractNode, nodeName: string): AbstractNode {
  if (nodeName === 'document' || nodeName === 'embedded' || !nodeName) {
    return adocNode;
  }
  if (nodeName.startsWith('inline_')) {
    return adoc.Inline.create(adocNode as AbstractBlock, nodeName);
  } else {
    return adoc.Block.create(adocNode as AbstractBlock, nodeName);
  }
}

function isUnconstrained(domNode: DomElement): boolean {
  return /\w$/.test(domNode.previousSibling()?.textContent ?? '') ||
    /^\w/.test(domNode.nextSibling()?.textContent ?? '');
}

function buildInlineQuoted(domNode: DomElement, content: string): string {
  if (domNode.getAttribute('prop-type') === 'asciimath') {
    return `stem:[${content}]`;
  }
  const times = isUnconstrained(domNode) ? 2 : 1;
  switch (domNode.getAttribute('prop-type')) {
    case 'double':
      return `"\`${content}\`"`;
    case 'single':
      return `'\`${content}\`'`;
    case 'unquoted':
      return `[.${domNode.getAttribute('data-role')}]#${content}#`;
    default:
      const quote = quoteTypeToChar(domNode)?.repeat(times) ?? '';
      return [quote, content, quote].join('');
  }
}

function buildInlineAnchor(domNode: DomElement, content: string): string {
  const role = domNode.getAttribute('data-role');
  const window = domNode.getAttribute('data-window');
  const target = domNode.getAttribute('prop-target').replace(/\.html\b/, '.adoc');
  if (role === undefined) {
    if (target.startsWith('mailto:')) {
      return content;
    } else {
      if (target === '#' + content) {
        return `<<${content}>>`;
      } else {
        return `<<${target.replace(/^#/, '')},${content}>>`;
      }
    }
  } else if (role === 'bare') {
    return target;
  } else if (role && target) {
    return `${target}[${content}${window === '_blank' ? '^' : ''}, role=${role}]`;
  } else {
    return '';
  }
}

function buildInlineImage(domNode: DomElement) {
  const alt = domNode.getAttribute('prop-alt');
  const defaultAlt = domNode.getAttribute('data-default-alt');
  const nonDefaultAlt = alt === defaultAlt ? '' : alt;
  const target = domNode.getAttribute('prop-target');
  const type = domNode.getAttribute('prop-type');
  switch (type) {
    case 'icon':
      const link = domNode.getAttribute('data-link');
      const window = domNode.getAttribute('data-window');
      return `icon:${target}[link=${link},window=${window}]`;
    default:
      return `image:${target}[${nonDefaultAlt}]`;
  }
}

function buildInlineKbd(domNode: DomElement): string {
  const keys = domNode.querySelectorAll(it => it.isTagOf('kbd')).map(it => it.textContent);
  return `kbd:[${keys.join('+')}]`;
}

function buildInlineButton(domNode: DomElement): string {
  return `btn:[${domNode.textContent}]`;
}

function buildInlineMenu(domNode: DomElement): string {
  const items = domNode.querySelectorAll(it => it.isTagOf('span')).map(it => it.textContent);
  const menu = items.slice(0, 1);
  const submenus = items.slice(1, items.length - 1);
  const menuItem = items.slice(items.length - 1, items.length);
  return `menu:${menu}[${[...submenus, menuItem].filter(it => !!it).join(' > ')}]`;
}

function buildInlineIndexTerm(domNode: DomElement): string {
  const terms = domNode.querySelectorAll(it => it.hasClass('term')).map(it => addQuotes(it.textContent));
  const isInline = domNode.getAttribute('prop-type') === 'visible';
  if (isInline) {
    return `((${terms.join(', ')}))`;
  } else {
    if (domNode.nextSibling()?.textContent.startsWith('\n')) {
      return `(((${terms.join(', ')})))`;
    } else {
      return `(((${terms.join(', ')})))\n`;
    }
  }
}

function buildInlineFootNote(domNode: DomElement): string {
  const type = domNode.getAttribute('prop-type');
  if (!type) {
    return `footnote:[${domNode.textContent}]`;
  } else if (type === 'ref') {
    const id = domNode.getAttribute('attr-id') ?? '';
    return `footnote:${id}[${domNode.textContent}]`;
  } else if (type === 'xref') {
    const target = domNode.getAttribute('prop-target') ?? '';
    return `footnote:${target}[]`;
  }
}

function toAdocLines(domNode: DomNode): string {
  if (domNode instanceof DomElement) {
    const content = domNode.childNodes.map(it => toAdocLines(it)).join('');
    const adocName = domNode.getAttribute('adoc-name');
    switch (adocName) {
      case 'inline_quoted':
        return buildInlineQuoted(domNode, content);
      case 'inline_anchor':
        return buildInlineAnchor(domNode, content);
      case 'inline_image':
        return buildInlineImage(domNode);
      case 'inline_kbd':
        return buildInlineKbd(domNode);
      case 'inline_button':
        return buildInlineButton(domNode);
      case 'inline_menu':
        return buildInlineMenu(domNode);
      case 'inline_indexterm':
        return buildInlineIndexTerm(domNode);
      case 'inline_footnote':
        return buildInlineFootNote(domNode);
      default:
        return content;
    }
  } else if (domNode instanceof DomText) {
    // 如果网址没有包含在链接中，说明它是被专门转义过的
    if (!domNode.queryAncestor(it => it.isTagOf('a'))) {
      return domNode.textContent
        .replace(/\b(https?:)/, '\\$1')
        .replace(/\b([\w.-]+@[\w.-]+)/, '\\$1');
    }

    return domNode.textContent;
  }
}

function decompile(adoc: Asciidoctor, adocNode: AbstractNode, domNode: DomElement): void {
  const name = domNode.getAttribute('adoc-name');
  const node = createAdocNode(adoc, adocNode, name);
  if (Adoc.isAbstractBlock(node) && !Adoc.isDocument(node)) {
    (adocNode as AbstractBlock).append(node);
  }
  loadAttributes(domNode, node);
  domNode.children.forEach(it => {
    decompile(adoc, node, it);
  });
  if (Adoc.hasLines(node)) {
    node.lines = toAdocLines(domNode).split('\n');
  }
}

export function tinyHtmlDomToAdoc(tinyHtmlDoc: DomDocumentFragment | DomDocument): Asciidoctor.Document {
  const adoc = createAsciidoctor();
  const root = adoc.load('', { backend: 'adoc' });
  decompile(adoc, root, tinyHtmlDoc.querySelector(it => it.isTagOf('article')));
  return root;
}

export function tinyHtmlToAdoc(tinyHtml: string): string {
  const adoc = tinyHtmlDomToAdoc(DomDocument.parse(tinyHtml));
  return Adoc.unescapeDirectives(adoc.convert({ backend: 'adoc' }).trim());
}
