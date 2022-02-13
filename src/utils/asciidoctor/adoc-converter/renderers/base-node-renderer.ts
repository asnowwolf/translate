import { AdocAttribute, AdocNode } from './adoc-node';
import { addQuotes } from './utils/add-quotes';

export interface NodeRenderer<T extends AdocNode> {
  render(node: T): string;
}

export abstract class BaseNodeRenderer<T extends AdocNode> implements NodeRenderer<T> {
  abstract render(node: T): string;

  protected defaultAttributes: { [name: string]: any } = {};
  protected ignoredAttributes: string[] = [];

  protected getAttributes(node: T): AdocAttribute[] {
    const $$keys = node.attributes.$$keys;
    const result = $$keys.map(($$key) => {
      if (typeof $$key === 'string') {
        return { positional: false, name: $$key, value: node.getAttribute($$key) };
      } else {
        const { key_hash, value } = $$key;
        return { positional: true, name: predefinedKeyNames[key_hash] as string, value };
      }
    });
    return moveIdToFirst(result.filter(it => !correspondingPositionalExists(it, result)));
  }

  protected getNonDefaultAttributes(attributes: AdocAttribute[]): AdocAttribute[] {
    return attributes.filter(({ positional, name, value }) =>
      !['title', ...this.ignoredAttributes].includes(name) && this.defaultAttributes[name] !== value);
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

const predefinedKeyNames = {
  3: 'alt',
  5: 'width',
  7: 'height',
};
