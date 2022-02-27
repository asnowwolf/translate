import { BaseNodeRenderer } from './base-node-renderer';
import asciidoctor, { Asciidoctor } from '@asciidoctor/core';
import Author = Asciidoctor.Document.Author;
import Document = Asciidoctor.Document;

interface DocumentAttributes {
  doctitle: string;
}

function buildAuthorLine(author: Author) {
  if (author.getEmail()) {
    return `${author.getName()} <${author.getEmail()}>`;
  } else {
    return author.getName();
  }
}

function getLinesBeforeTitle(node: Document, id: string): string {
  if (!id) {
    return '';
  }
  const idText = `[[${id}]]`;
  const lines = node.getSourceLines();
  const index = lines.indexOf(idText);
  if (index === -1) {
    return idText;
  } else {
    return lines.slice(0, index + 1).join('\n');
  }
}

export class DocumentRenderer extends BaseNodeRenderer<Document> {
  protected helperAdoc = asciidoctor();

  getDefaultAttributes(node: Document): { [key: string]: any } {
    return this.helperAdoc.load('').getAttributes();
  }

  ignoredAttributeNames = [
    'sectnums',
    'doctitle',
    /^firstname\w*$/,
    /^authorinitials\w*$/,
    /^middlename\w*$/,
    /^lastname\w*$/,
    /^author\w*$/,
    /^email\w*$/,
    'authors',
    'authorcount',
    'localtime',
    'localdatetime',
    'doctime',
    'docdatetime',
    'outfilesuffix',
    'filetype',
    'filetype-adoc',
    /doctype(-[-\w]+)?/,
    /backend(-[-\w]+)?/,
    /basebackend(-[-\w]+)?/,
  ];

  render(node: Document): string {
    const attributes = node.getAttributes() as DocumentAttributes;
    const doctitle = attributes.doctitle;
    const nonDefaultAttributes = this.getNonDefaultAttributes(node);
    const children = node.getContent();
    const id = node.getId();
    // 作者这一行也可能是一句 include:: 指令，但是现在用的转换机制无法正确识别 include:: 指令，因此只能把它替换回去
    const authors = node.getAuthors().map(author => buildAuthorLine(author)).join('; ');
    const body = [
      getLinesBeforeTitle(node, id),
      doctitle && `= ${doctitle}`,
      authors,
      nonDefaultAttributes.map(it => renderAttribute(it.name, it.value)).join('\n'),
    ].filter(it => !!it).join('\n');
    return body + '\n\n' + children;
  }
}

function renderAttribute(key, value): string {
  if (key === 'revnumber') {
    return `v${value}`;
  }
  return [`:${key}:`, value].filter(it => !!it).join(' ');
}
