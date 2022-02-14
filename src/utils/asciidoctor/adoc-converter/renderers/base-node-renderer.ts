import { AdocAttribute, AdocNode } from './adoc-node';
import { addQuotes } from './utils/add-quotes';
import { InlineableAttribute } from './utils/inlineable-attributes';

export interface NodeRenderer<T extends AdocNode> {
  render(node: T): string;
}

export abstract class BaseNodeRenderer<T extends AdocNode> implements NodeRenderer<T> {
  abstract render(node: T): string;

  protected defaultAttributes: { [name: string]: any } = {};
  protected ignoredAttributeNames: readonly string[] = [];
  protected globalIgnoredAttributeNames: readonly string[] = ['attribute_entries', 'title', 'target'];

  protected positionalAttributes: readonly InlineableAttribute[] = [];

  protected inlineAttributeNames: string[] = [];

  protected isInlineAttribute(it: AdocAttribute) {
    return this.inlineAttributeNames.includes(it.name);
  }

  protected getAttributes(node: T): AdocAttribute[] {
    const $$keys = node.attributes.$$keys;
    const result = $$keys
      .map(($$key) => {
        if (typeof $$key === 'string') {
          return { positional: false, name: $$key, value: node.getAttribute($$key) };
        } else {
          const { key, value } = $$key;
          return { positional: true, name: this.positionalAttributes.find(it => it.position === key)?.name, value };
        }
      })
      .filter(it => ![...this.globalIgnoredAttributeNames, ...this.ignoredAttributeNames].includes(it.name));
    return moveIdToFirst(result.filter(it => !correspondingPositionalExists(it, result)));
  }

  protected getNonDefaultAttributes(node: T): AdocAttribute[] {
    return this.getAttributes(node).filter(({ positional, name, value }) => this.defaultAttributes[name] !== value);
  }

  protected getBlockAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => !this.isInlineAttribute(it));
  }

  protected getInlineAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => this.isInlineAttribute(it));
  }

  protected renderAttributes(attributes: AdocAttribute[]): string {
    const id = attributes.find(it => it.name === 'id');
    const options = attributes.find(it => it.name === 'options' || it.name === 'opts');
    const content = shortenAttributes(attributes, id, options)
      .map(it => this.renderAttribute(it))
      .filter(it => !!it).join(', ');
    return content ?? '';
  }

  protected renderAttribute(attr: AdocAttribute) {
    const value = addQuotes(attr.value);
    if (attr.name === 'id') {
      return `#${value}`;
    } else if (attr.name === 'options' || attr.name === 'opts') {
      return `%${value}`;
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

// 简写 id 和 options 属性，把它们添加特定的前缀，然后追加到第一个位置参数后面
function shortenAttributes(attributes: AdocAttribute[], id: AdocAttribute, options: AdocAttribute): AdocAttribute[] {
  if (!attributes[0]?.positional) {
    return attributes;
  } else {
    const idText = id?.value && `#${addQuotes(id.value)}`;
    const optionsText = options?.value && `%${addQuotes(options.value)}`;
    return attributes
      .filter(it => !['id', 'options', 'opts'].includes(it.name))
      .map((it, index) => index === 0 ? { ...it, value: [it.value, idText, optionsText].filter(Boolean).join('') } : it);
  }
}
