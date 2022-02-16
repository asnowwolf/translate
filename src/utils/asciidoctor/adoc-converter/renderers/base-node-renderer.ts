import { AdocAttribute, AdocNode } from './adoc-node';
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
      .filter(it => {
        return ![...this.globalIgnoredAttributeNames, ...this.ignoredAttributeNames].includes(it.name) && !it.name?.endsWith('-option');
      });
    return moveIdToFirst(result.filter(it => !correspondingPositionalExists(it, result)));
  }

  protected getDefaultAttributes(node: T): { [name: string]: any } {
    return {};
  }

  protected getNonDefaultAttributes(node: T): AdocAttribute[] {
    const defaultAttributes = this.getDefaultAttributes(node);
    return this.getAttributes(node).map((attr) => {
      if (defaultAttributes[attr.name] === attr.value) {
        return;
      } else if (attr.name === 'options') {
        return {
          ...attr,
          value: attr.value.split(',').map(subValue => subValue.trim())
            .filter(it => defaultAttributes[attr.name] !== it)
            .join(', '),
        };
      } else {
        return attr;
      }
    }).filter(it => !!it);
  }

  protected getBlockAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => !this.isInlineAttribute(it));
  }

  protected getInlineAttributes(node: T) {
    return this.getNonDefaultAttributes(node).filter(it => this.isInlineAttribute(it));
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
