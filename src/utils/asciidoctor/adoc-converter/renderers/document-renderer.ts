import * as asciidoctor from 'asciidoctor.js';
import { BaseNodeRenderer } from './base-node-renderer';
import { AdocNode } from './adoc-node';

export interface Author {
  getName(): string;

  getEmail(): string;
}

export interface DocumentNode extends AdocNode {
  getDocumentTitle(): string;

  getAuthors(): Author[];

  getAttributes(): { [key: string]: any };
}

export class DocumentRenderer extends BaseNodeRenderer<DocumentNode> {
  protected helperAdoc = asciidoctor();

  getDefaultAttributes(node: DocumentNode): { [key: string]: any } {
    return this.helperAdoc.load('').getAttributes();
  }

  ignoredAttributeNames = [
    'sectnums',
    'doctitle',
    'firstname',
    'authorinitials',
    'middlename',
    'lastname',
    'author',
    'email',
    'authors',
    'authorcount',
    'localtime',
    'localdatetime',
    'doctime',
    'docdatetime',
  ];

  render(node: DocumentNode): string {
    const doctitle = node.getAttributes().doctitle;
    const nonDefaultAttributes = this.getNonDefaultAttributes(node);
    return [
      doctitle && `= ${doctitle}`,
      node.getAuthors().map(author => `${author.getName()} <${author.getEmail()}>`).join(';'),
      nonDefaultAttributes.map(({ name, value }) => renderAttribute(name, value)).join('\n'),
      node.getContent(),
    ].filter(it => !!it).join('\n');
  }

}

function renderAttribute(key, value): string {
  return [`:${key}:`, value].filter(it => !!it).join(' ');
}
