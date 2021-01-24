import { DocumentMode, parseFragment, serialize } from 'parse5';
import { treeAdapter } from '../dom-tree-adapter';


export class DomNode {
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

  nextSibling(): DomNode {
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

export type DomSelector = (node: DomElement) => boolean;

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
    return serialize(this, { treeAdapter });
  }
}

export class DomDocumentFragment extends DomParentNode {
  nodeName: '#document-fragment' = '#document-fragment';

  toHtml(): string {
    return serialize(this, { treeAdapter });
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
    return serialize(this, { treeAdapter });
  }

  set innerHTML(html: string) {
    this.childNodes = parseFragment(html, { treeAdapter }).childNodes;
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
