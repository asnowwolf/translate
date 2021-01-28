import { DocumentMode, ElementLocation, Location, StartTagLocation, TreeAdapterTypeMap, TypedTreeAdapter } from 'parse5';
import {
  DomAttr,
  DomChildNode,
  DomComment,
  DomDocument,
  DomDocumentFragment,
  DomDocumentType,
  DomElement,
  DomNode,
  DomParentNode,
  DomTableCellElement,
  DomTableElement,
  DomTableRowElement,
  DomText,
} from './dom-models';

export interface DomTreeAdapterTypeMap extends TreeAdapterTypeMap {
  attribute: DomAttr;
  childNode: DomChildNode;
  commentNode: DomComment;
  document: DomDocument;
  documentFragment: DomDocumentFragment;
  documentType: DomDocumentType;
  element: DomElement;
  node: DomNode;
  parentNode: DomParentNode;
  textNode: DomText;
}

export class DomTreeAdapter implements TypedTreeAdapter<DomTreeAdapterTypeMap> {
  private constructor() {
  }

  static create(): TypedTreeAdapter<DomTreeAdapterTypeMap> {
    return new DomTreeAdapter();
  }

  adoptAttributes(recipient: DomTreeAdapterTypeMap['element'], attrs: Array<DomTreeAdapterTypeMap['attribute']>): void {
    recipient.setAttributes(...attrs);
  }

  appendChild(parentNode: DomTreeAdapterTypeMap['parentNode'], newNode: DomTreeAdapterTypeMap['node']): void {
    parentNode.appendChild(newNode as DomChildNode);
  }

  createCommentNode(data: string): DomTreeAdapterTypeMap['commentNode'] {
    return new DomComment(data);
  }

  createDocument(): DomTreeAdapterTypeMap['document'] {
    return new DomDocument();
  }

  createDocumentFragment(): DomTreeAdapterTypeMap['documentFragment'] {
    return new DomDocumentFragment();
  }

  createElement(tagName: string, namespaceURI: string, attrs: Array<DomTreeAdapterTypeMap['attribute']>): DomTreeAdapterTypeMap['element'] {
    switch (tagName) {
      case 'table':
        return new DomTableElement(tagName, attrs, namespaceURI);
      case 'tr':
        return new DomTableRowElement(tagName, attrs, namespaceURI);
      case 'th':
      case 'td':
        return new DomTableCellElement(tagName, attrs, namespaceURI);
      default:
        return new DomElement(tagName, attrs, namespaceURI);
    }
  }

  detachNode(node: DomTreeAdapterTypeMap['node']): void {
    if (node instanceof DomChildNode) {
      node.remove();
    }
  }

  getAttrList(element: DomTreeAdapterTypeMap['element']): Array<DomTreeAdapterTypeMap['attribute']> {
    return element.attrs;
  }

  getChildNodes(node: DomTreeAdapterTypeMap['parentNode']): Array<DomTreeAdapterTypeMap['childNode']> {
    return node.childNodes;
  }

  getCommentNodeContent(commentNode: DomTreeAdapterTypeMap['commentNode']): string {
    return commentNode.data;
  }

  getDocumentMode(document: DomTreeAdapterTypeMap['document']): DocumentMode {
    return document.mode;
  }

  getDocumentTypeNodeName(doctypeNode: DomTreeAdapterTypeMap['documentType']): string {
    return doctypeNode.name;
  }

  getDocumentTypeNodePublicId(doctypeNode: DomTreeAdapterTypeMap['documentType']): string {
    return doctypeNode.publicId;
  }

  getDocumentTypeNodeSystemId(doctypeNode: DomTreeAdapterTypeMap['documentType']): string {
    return doctypeNode.systemId;
  }

  getFirstChild(node: DomTreeAdapterTypeMap['parentNode']): DomTreeAdapterTypeMap['childNode'] | undefined {
    return node.childNodes?.[0];
  }

  getNamespaceURI(element: DomTreeAdapterTypeMap['element']): string {
    return element.namespaceURI;
  }

  getNodeSourceCodeLocation(node: DomTreeAdapterTypeMap['node']): Location | StartTagLocation | ElementLocation {
    return undefined;
  }

  getParentNode(node: DomTreeAdapterTypeMap['childNode']): DomTreeAdapterTypeMap['parentNode'] {
    return node.parentNode;
  }

  getTagName(element: DomTreeAdapterTypeMap['element']): string {
    return element.tagName;
  }

  getTemplateContent(templateElement: DomTreeAdapterTypeMap['element']): DomTreeAdapterTypeMap['documentFragment'] {
    return templateElement.templateContent;
  }

  getTextNodeContent(textNode: DomTreeAdapterTypeMap['textNode']): string {
    return textNode.value;
  }

  insertBefore(parentNode: DomTreeAdapterTypeMap['parentNode'], newNode: DomTreeAdapterTypeMap['node'], referenceNode: DomTreeAdapterTypeMap['node']): void {
    parentNode.insertBefore(newNode as DomChildNode, referenceNode as DomChildNode);
  }

  insertText(parentNode: DomTreeAdapterTypeMap['parentNode'], text: string): void {
    parentNode.appendChild(new DomText(text));
  }

  insertTextBefore(parentNode: DomTreeAdapterTypeMap['parentNode'], text: string, referenceNode: DomTreeAdapterTypeMap['node']): void {
    this.insertBefore(parentNode, new DomText(text), referenceNode);
  }

  isCommentNode(node: DomTreeAdapterTypeMap['node']): node is DomTreeAdapterTypeMap['commentNode'] {
    return node instanceof DomComment;
  }

  isDocumentTypeNode(node: DomTreeAdapterTypeMap['node']): node is DomTreeAdapterTypeMap['documentType'] {
    return node instanceof DomDocumentType;
  }

  isElementNode(node: DomTreeAdapterTypeMap['node']): node is DomTreeAdapterTypeMap['element'] {
    return node instanceof DomElement;
  }

  isTextNode(node: DomTreeAdapterTypeMap['node']): node is DomTreeAdapterTypeMap['textNode'] {
    return node instanceof DomText;
  }

  setDocumentMode(document: DomTreeAdapterTypeMap['document'], mode: DocumentMode): void {
    document.mode = mode;
  }

  setDocumentType(document: DomTreeAdapterTypeMap['document'], name: string, publicId: string, systemId: string): void {
    document.prepend(new DomDocumentType(name, publicId, systemId));
  }

  setNodeSourceCodeLocation(node: DomTreeAdapterTypeMap['node'], location: Location | StartTagLocation | ElementLocation): void {
  }

  setTemplateContent(templateElement: DomTreeAdapterTypeMap['element'], contentElement: DomTreeAdapterTypeMap['documentFragment']): void {
  }
}

export const treeAdapter = DomTreeAdapter.create();
