import { InlineableAttribute } from './utils/inlineable-attributes';
import { matchAny } from './utils/match-any';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractNode = Asciidoctor.AbstractNode;
import AttributeEntry = Asciidoctor.Document.AttributeEntry;

export interface NodeRenderer<T extends AbstractNode> {
  render(node: T): string;
}

export abstract class BaseNodeRenderer<T extends AbstractNode> implements NodeRenderer<T> {
  abstract render(node: T): string;

  protected ignoredAttributeNames: readonly (string | RegExp)[] = [];
  protected globalIgnoredAttributeNames: readonly (string | RegExp)[] = ['attribute_entries', 'title', 'target'];

  protected positionalAttributes: readonly InlineableAttribute[] = [];

  protected inlineAttributeNames: (string | RegExp)[] = [];

  protected isInlineAttribute(it: AttributeEntry) {
    return matchAny(it.name, this.inlineAttributeNames);
  }

  protected getAttributes(node: T): AttributeEntry[] {
    const $$keys = node.attributes.$$keys;
    const result = $$keys
      .map(($$key) => {
        if (typeof $$key === 'string') {
          if (!this.isPositionalAttribute($$key)) {
            return { position: undefined, name: $$key, value: node.getAttribute($$key), negate: false };
          }
        } else {
          const positionalAttribute = this.positionalAttributes.find(it => it.position === $$key.key);
          if (positionalAttribute) {
            const name = positionalAttribute.name;
            // 由于 setAttribute 不会更改 $$keys 中的 value，因此这里要重新取一下属性值
            const value = node.getAttribute(name);
            return { position: $$key.key, name, value, negate: false };
          } else {
            return { position: $$key.key, name: '1', value: $$key.value, negate: false };
          }
        }
      })
      .filter(it => !!it)
      .filter(it => !matchAny(it.name, [...this.globalIgnoredAttributeNames, ...this.ignoredAttributeNames]));
    return moveIdToFirst(result.filter(it => !correspondingPositionalExists(it, result)));
  }

  private isPositionalAttribute($$key: string) {
    return this.positionalAttributes.some(it => it.name === $$key);
  }

  protected getDefaultAttributes(node: T): { [name: string]: any } {
    return {};
  }

  protected getNonDefaultAttributes(node: T): AttributeEntry[] {
    const defaultAttributes = this.getDefaultAttributes(node);
    return this.getAttributes(node).map((attr) => {
      if (defaultAttributes[attr.name] === attr.value) {
        return;
      } else if (attr.name === 'options') {
        return {
          ...attr,
          value: (attr.value as string).split(',').map(subValue => subValue.trim())
            .filter(it => defaultAttributes[attr.name] !== it)
            .join(','),
        };
      } else {
        return attr;
      }
    }).filter(it => !!it);
  }

  protected getBlockAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => !this.isInlineAttribute(it));
  }

  protected getInlineAttributes(node: T): AttributeEntry[] {
    return this.getNonDefaultAttributes(node).filter(it => this.isInlineAttribute(it));
  }
}

function correspondingPositionalExists(attribute: AttributeEntry, existingAttributes: AttributeEntry[]): boolean {
  return !attribute.position && !!existingAttributes.find(it => {
    return it.position && it.name === attribute.name && it.value === attribute.value;
  });
}

function moveIdToFirst(attributes: AttributeEntry[]): AttributeEntry[] {
  const id = attributes.find(it => it.name === 'id');
  if (!id) {
    return attributes;
  } else {
    return [id, ...attributes.filter(it => it !== id)];
  }
}
