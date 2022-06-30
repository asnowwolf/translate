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

  get lastChild(): DomChildNode {
    return this.childNodes?.[this.childNodes.length - 1];
  }

  get children(): DomElement[] {
    return this.childNodes?.filter(child => child instanceof DomElement) as DomElement[];
  }

  get firstElementChild(): DomElement {
    return this.children?.[0];
  }

  get lastElementChild(): DomElement {
    return this.children?.[this.children.length - 1];
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

  previousSibling(): DomChildNode {
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

  queryAncestor(selector: DomSelector): boolean {
    return this.parentElement && (selector(this.parentElement) || this.parentElement.queryAncestor(selector));
  }

  appendChild<T extends DomChildNode | DomText>(child: T): T {
    if (this instanceof DomParentNode) {
      child.parentNode = this;
      this.childNodes.push(child);
    }
    return child;
  }

  insertBefore<T extends DomChildNode | DomText>(newNode: T, referenceNode: DomNode): T {
    newNode.remove();
    this.childNodes.splice(referenceNode.index, 0, newNode);
    return newNode;
  }

  insertAfter<T extends DomChildNode | DomText>(newNode: T, referenceNode: DomNode): T {
    newNode.remove();
    this.childNodes.splice(referenceNode.index + 1, 0, newNode);
    return newNode;
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

  mergeTextNodes(): void {
    let text = '';
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      const node = this.childNodes[i];
      if (node instanceof DomText) {
        text = node.value + text;
        if (!(node.previousSibling() instanceof DomText)) {
          node.value = text;
          text = '';
        } else {
          node.remove();
        }
      }

      if (node instanceof DomParentNode) {
        node.mergeTextNodes();
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
    const element = this.titleElement || this.head.appendChild(new DomElement('title'));
    element.textContent = value ?? '';
  }

  private get titleElement(): DomElement {
    const element = this.querySelector(it => it.isTagOf('title'));
    if (element) {
      return element;
    }
  }

  toHtml(): string {
    // 如果是文档片段，则只序列化 body，否则序列化整个对象
    return serialize(this, { treeAdapter: DomNode.treeAdapter });
  }

  toFragment(): string {
    return serialize(this.body, { treeAdapter: DomNode.treeAdapter });
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
    const fragment = parseFragment(html, { treeAdapter: DomNode.treeAdapter });
    this.childNodes = fragment.childNodes;
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

  getAttributes(): DomAttr[] {
    return this.attrs;
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

  hasClass(...classNames: string[]): boolean {
    const classes = this.getAttribute('class')?.split(' ');
    return classNames.some(it => classes?.includes(it));
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
const elementSelectors: DomSelector[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 't', 'nt-wrapper']
  .map(it => (node: DomElement) => node.isTagOf(it));
const attributeSelector: DomSelector = (node: DomElement) => node.hasAttribute('ng-should-translate');
export const defaultSelectors: DomSelector[] = [...elementSelectors, attributeSelector];
