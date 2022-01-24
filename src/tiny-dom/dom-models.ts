import { DocumentMode, parse, parseFragment, serialize } from 'parse5';
import { DomTreeAdapter } from './dom-tree-adapter';

export class DomNode {
  static readonly treeAdapter = DomTreeAdapter.create();

  nodeName: string;
  parentNode?: DomParentNode;
  childNodes?: DomChildNode[] = [];

  get index(): number {
    if (!(this instanceof DomChildNode)) {
      return -1;
    }
    return this.parentNode?.childNodes.indexOf(this);
  }

  get indexOfElement(): number {
    if (!(this instanceof DomElement)) {
      return -1;
    }
    return this.parentNode?.children.indexOf(this);
  }

  get firstChild(): DomChildNode {
    return this.childNodes?.[0];
  }

  get textContent(): string {
    let result = '';
    if (this instanceof DomText) {
      result += this.value;
    } else if (this instanceof DomParentNode) {
      result += this.childNodes.map(it => it.textContent).join('');
    }
    return result;
  }

  set textContent(value: string) {
    this.childNodes = [new DomText(value)];
  }

  get parentElement(): DomElement {
    let parent = this.parentNode;
    while (parent) {
      if (parent instanceof DomElement) {
        return parent;
      }
      parent = parent.parentNode;
    }
  }

  get previousElementSibling(): DomElement {
    let node = this.previousSibling();
    while (node) {
      if (node instanceof DomElement) {
        return node;
      }
      node = node.previousSibling();
    }
  }

  get nextElementSibling(): DomElement {
    let node = this.nextSibling();
    while (node) {
      if (node instanceof DomElement) {
        return node;
      }
      node = node.nextSibling();
    }
  }

  previousSibling(): DomNode {
    if (this.index === -1) {
      return;
    }
    return this.parentNode?.childNodes[this.index - 1];
  }

  nextSibling(): DomChildNode {
    if (this.index === -1) {
      return;
    }
    return this.parentNode?.childNodes[this.index + 1];
  }

  appendChild(child: DomChildNode): void {
    if (this instanceof DomParentNode) {
      child.parentNode = this;
      this.childNodes.push(child);
    }
  }

  insertBefore(newNode: DomChildNode, referenceNode: DomChildNode) {
    newNode.remove();
    this.childNodes.splice(referenceNode.index, 0, newNode);
  }

  insertAfter(newNode: DomChildNode, referenceNode: DomChildNode) {
    newNode.remove();
    this.childNodes.splice(referenceNode.index + 1, 0, newNode);
  }
}

export class DomAttr {
  name: string;
  value: string;
}

export class DomChildNode extends DomNode {
  remove(): void {
    if (!this.parentNode) {
      return;
    }
    this.parentNode.childNodes.splice(this.index, 1);
  }
}

export class DomParentNode extends DomChildNode {
  get children(): DomElement[] {
    return this.childNodes.filter(it => it instanceof DomElement) as DomElement[];
  }

  prepend(node: DomChildNode): void {
    this.childNodes.unshift(node);
  }

  querySelectorAll<T extends DomElement = DomElement>(selector: DomSelector): T[] {
    const result = [];
    for (const child of this.children) {
      if (selector(child)) {
        result.push(child);
      }
      result.push(...child.querySelectorAll(selector));
    }
    return result;
  }

  querySelector<T extends DomElement = DomElement>(selector: DomSelector): T {
    for (const child of this.children) {
      if (selector(child)) {
        return child as T;
      }
      const subNode = child.querySelector(selector);
      if (subNode) {
        return subNode as T;
      }
    }
  }
}

export class DomComment extends DomChildNode {
  nodeName: '#comment' = '#comment';

  constructor(public data: string) {
    super();
  }
}

export class DomDocument extends DomParentNode {
  nodeName: '#document' = '#document';
  mode: DocumentMode;

  get head(): DomElement {
    return this.querySelector(it => it.isTagOf('head'));
  }

  get body(): DomElement {
    return this.querySelector(it => it.isTagOf('body'));
  }

  get title(): string {
    return this.titleElement?.textContent;
  }

  set title(value: string) {
    const element = this.titleElement;
    if (element) {
      element.textContent = value;
    }
  }

  private get titleElement(): DomElement {
    return this.querySelector(it => it.isTagOf('title'));
  }

  toHtml(): string {
    // 如果是文档片段，则只序列化 body，否则序列化整个对象
    return serialize(this.isFragment() ? this.body : this, { treeAdapter: DomNode.treeAdapter });
  }

  isFragment(): boolean {
    // 目前看来，片段和非片段的主要差别是 mode 为 'quirks'，并且head 中没有任何东西
    return this.mode === 'quirks' && this.head.childNodes.length === 0;
  }

  static parse(content: string): DomDocument {
    return parse(content, { treeAdapter: DomNode.treeAdapter });
  }
}

export class DomDocumentFragment extends DomParentNode {
  nodeName: '#document-fragment' = '#document-fragment';

  toHtml(): string {
    return serialize(this, { treeAdapter: DomNode.treeAdapter });
  }

  static parse(content: string): DomDocumentFragment {
    return parseFragment(content, { treeAdapter: DomNode.treeAdapter });
  }
}

export class DomDocumentType extends DomChildNode {
  nodeName: '#documentType' = '#documentType';

  constructor(
    public name: string,
    public publicId: string,
    public systemId: string,
  ) {
    super();
  }
}

function isSameName(name1: string, name2: string) {
  return name1?.localeCompare(name2) === 0;
}

export class DomElement extends DomParentNode implements DomChildNode {
  constructor(
    public tagName: string,
    public attrs: DomAttr[] = [],
    public namespaceURI = 'http://www.w3.org/1999/xhtml',
  ) {
    super();
    this.nodeName = tagName;
  }

  get innerHTML(): string {
    return serialize(this, { treeAdapter: DomNode.treeAdapter });
  }

  set innerHTML(html: string) {
    this.childNodes = parseFragment(html, { treeAdapter: DomNode.treeAdapter }).childNodes;
  }

  get outerHTML(): string {
    const node = new DomElement('div');
    node.childNodes = [this];
    return node.innerHTML;
  }

  get className(): string {
    return this.getAttributeNode('class')?.value;
  }

  get templateContent(): DomDocumentFragment {
    let parent = this.parentNode;
    while (parent) {
      if (parent instanceof DomDocumentFragment) {
        return parent;
      }
      parent = parent.parentNode;
    }
  }

  getAttributeNode(name: string): DomAttr {
    return this.attrs.find(it => isSameName(it.name, name));
  }

  getAttribute(name: string): string {
    return this.getAttributeNode(name)?.value;
  }

  hasAttribute(name: string): boolean {
    return !!this.getAttributeNode(name);
  }

  setAttribute(name: string, value: string): void {
    const attr = this.getAttributeNode(name);
    if (!attr) {
      this.attrs.push({ name, value });
    } else {
      attr.value = value;
    }
  }

  setAttributes(...domAttrs: DomAttr[]): void {
    this.attrs.push(...domAttrs);
  }

  removeAttribute(name: string): void {
    const index = this.attrs.findIndex(it => isSameName(it.name, name));
    if (index !== -1) {
      this.attrs.splice(index, 1);
    }
  }

  isSameTag(element: DomElement): boolean {
    return this.isTagOf(element.tagName);
  }

  isTagOf(...names: string[]): boolean {
    return !!names.find(name => isSameName(this.tagName, name));
  }
}

export class DomText extends DomChildNode {
  nodeName: '#text' = '#text';

  constructor(public value: string) {
    super();
  }
}

export class DomTableElement extends DomElement {

}

export class DomTableCellElement extends DomElement {

}

export class DomTableRowElement extends DomElement {
  get cells(): DomTableCellElement[] {
    return this.children.filter(it => it.isTagOf('td') || it.isTagOf('th'));
  }
}

export type DomSelector = (node: DomElement) => boolean;
const elementSelectors: DomSelector[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 't'].map(it => (node: DomElement) => node.isTagOf(it));
const attributeSelector: DomSelector = (node: DomElement) => node.hasAttribute('ng-should-translate');
export const defaultSelectors: DomSelector[] = [...elementSelectors, attributeSelector];
