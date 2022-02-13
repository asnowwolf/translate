import { AdocAttribute, AdocNode } from './adoc-node';
import { addQuotes } from './utils/add-quotes';
import { InternalAttribute } from './utils/internal-attributes';

export interface NodeRenderer<T extends AdocNode> {
  render(node: T): string;
}

export abstract class BaseNodeRenderer<T extends AdocNode> implements NodeRenderer<T> {
  abstract render(node: T): string;

  protected defaultAttributes: { [name: string]: any } = {};
  protected ignoredAttributes: readonly string[] = [];
  protected globalIgnoredAttributes: readonly string[] = ['style', 'attribute_entries', 'title'];

  protected internalAttributes: readonly InternalAttribute[] = [];

  protected isInternalAttribute(it: AdocAttribute) {
    return this.internalAttributes.some(inner => inner.name === it.name);
  }

  protected getAttributes(node: T): AdocAttribute[] {
    const $$keys = node.attributes.$$keys;
    const result = $$keys
      .map(($$key) => {
        if (typeof $$key === 'string') {
          return { positional: false, name: $$key, value: node.getAttribute($$key) };
        } else {
          const { key, value } = $$key;
          return { positional: true, name: this.internalAttributes.find(it => it.position === key)?.name, value };
        }
      })
      .filter(it => ![...this.globalIgnoredAttributes, ...this.ignoredAttributes].includes(it.name));
    return moveIdToFirst(result.filter(it => !correspondingPositionalExists(it, result)));
  }

  protected getNonDefaultAttributes(node: T): AdocAttribute[] {
    return this.getAttributes(node).filter(({ positional, name, value }) => this.defaultAttributes[name] !== value);
  }

  protected getHeaderAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => !this.isInternalAttribute(it));
  }

  protected getInternalAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => this.isInternalAttribute(it));
  }

  protected renderAttributes(attributes: AdocAttribute[]): string {
    const content = attributes.map(it => this.renderAttribute(it))
      .filter(it => !!it).join(',');
    return content ?? '';
  }

  protected renderAttribute(attr: AdocAttribute) {
    const value = addQuotes(attr.value);
    if (attr.name === 'id') {
      return `#${value}`;
    } else if (attr.positional) {
      return value;
    } else {
      return `${attr.name}=${value}`;
    }
  }
}

function correspondingPositionalExists(attribute: AdocAttribute, existingAttributes: AdocAttribute[]): boolean {
  return !attribute.positional && !!existingAttributes.find(it => {
    return it.positional && it.name === attribute.name && it.value === attribute.value;
  });
}

function moveIdToFirst(attributes: AdocAttribute[]): AdocAttribute[] {
  const id = attributes.find(it => it.name === 'id');
  if (!id) {
    return attributes;
  } else {
    return [id, ...attributes.filter(it => it !== id)];
  }
}
