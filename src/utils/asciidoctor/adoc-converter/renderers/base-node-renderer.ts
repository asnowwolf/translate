import { AdocAttribute, AdocNode } from './adoc-node';
import { addQuotes } from './utils/add-quotes';
import { InlineableAttribute } from './utils/inlineable-attributes';

export interface NodeRenderer<T extends AdocNode> {
  render(node: T): string;
}

export abstract class BaseNodeRenderer<T extends AdocNode> implements NodeRenderer<T> {
  abstract render(node: T): string;

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
          return { name: $$key, value: node.getAttribute($$key) };
        } else {
          const { key, value } = $$key;
          const inlineableAttribute = this.positionalAttributes.find(it => it.position === key);
          return { position: key, name: inlineableAttribute?.name, value };
        }
      })
      .filter(it => ![...this.globalIgnoredAttributeNames, ...this.ignoredAttributeNames].includes(it.name));
    return moveIdToFirst(result.filter(it => !correspondingPositionalExists(it, result)));
  }

  protected getDefaultAttributes(node: T): { [name: string]: any } {
    return {};
  }

  protected getNonDefaultAttributes(node: T): AdocAttribute[] {
    return this.getAttributes(node).filter(({ name, value }) => this.getDefaultAttributes(node)[name] !== value);
  }

  protected getBlockAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => !this.isInlineAttribute(it));
  }

  protected getInlineAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => this.isInlineAttribute(it));
  }

  protected renderAttributes(attributes: AdocAttribute[]): string {
    const shortenAttributes = this.shortenAttributes(attributes);
    const content = shortenAttributes
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
    } else if (attr.position) {
      return value;
    } else {
      return `${attr.name}=${value}`;
    }
  }

  // 简写 id 和 options 属性，把它们添加特定的前缀，然后追加到第一个位置参数后面
  private shortenAttributes(attributes: AdocAttribute[]): AdocAttribute[] {
    const id = attributes.find(it => it.name === 'id');
    const options = attributes.find(it => it.name === 'options' || it.name === 'opts');

    // 如果没有定义位于第一位的位置属性，则不做任何处理
    if (!this.positionalAttributes.find(it => it.position === 1)) {
      return attributes;
    } else {
      const idText = id?.value && `#${addQuotes(id.value)}`;
      const optionsText = options?.value && `%${addQuotes(options.value)}`;
      const firstPositionalAttribute = attributes.find(it => it.position === 1);
      return attributes
        .filter(Boolean)
        .filter(it => !firstPositionalAttribute?.value || ![id, options].includes(it))
        .map((it) => it.name === firstPositionalAttribute?.name ? {
          ...it,
          value: [it.value, idText, optionsText].filter(Boolean).join(''),
        } : it);
    }
  }
}

function correspondingPositionalExists(attribute: AdocAttribute, existingAttributes: AdocAttribute[]): boolean {
  return !attribute.position && !!existingAttributes.find(it => {
    return it.position && it.name === attribute.name && it.value === attribute.value;
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
