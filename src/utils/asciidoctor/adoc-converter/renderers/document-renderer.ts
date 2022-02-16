import * as asciidoctor from 'asciidoctor.js';
import { BaseNodeRenderer } from './base-node-renderer';
import { Author, DocumentNode } from './dom/models';

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

export class DocumentRenderer extends BaseNodeRenderer<DocumentNode> {
  protected helperAdoc = asciidoctor();

  getDefaultAttributes(node: DocumentNode): { [key: string]: any } {
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
  ];

  render(node: DocumentNode): string {
    const attributes = node.getAttributes<DocumentAttributes>();
    const doctitle = attributes.doctitle;
    const nonDefaultAttributes = this.getNonDefaultAttributes(node);
    const children = node.getContent();
    const body = [
      doctitle && `= ${doctitle}`,
      node.getAuthors().map(author => buildAuthorLine(author)).join('; '),
      nonDefaultAttributes.map(it => renderAttribute(it.name, it.value)).join('\n'),
    ].filter(it => !!it).join('\n');
    return body + '\n\n' + children;
  }
}

function renderAttribute(key, value): string {
  return [`:${key}:`, value].filter(it => !!it).join(' ');
}
