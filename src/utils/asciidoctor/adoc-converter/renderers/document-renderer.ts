import { map, omitBy } from 'lodash';
import * as asciidoctor from 'asciidoctor.js';
import { NodeRenderer } from './node-renderer';
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

export class DocumentRenderer implements NodeRenderer<DocumentNode> {
  protected helperAdoc = asciidoctor();

  defaultAttributes = this.helperAdoc.load('').getAttributes();

  ignoredAttributes = [
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
    const nonDefaultAttributes = omitBy(node.getAttributes(), (value, key) =>
      this.ignoredAttributes.includes(key) || this.defaultAttributes[key] === value);
    return [
      doctitle && `= ${doctitle}`,
      node.getAuthors().map(author => `${author.getName()} <${author.getEmail()}>`).join(';'),
      map(nonDefaultAttributes, (value, key) => renderAttribute(key, value)).join('\n'),
      node.getContent(),
    ].filter(it => !!it).join('\n');
  }

}

function renderAttribute(key, value): string {
  return [`:${key}:`, value].filter(it => !!it).join(' ');
}
