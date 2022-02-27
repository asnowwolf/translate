import { BaseNodeRenderer } from './base-node-renderer';
import { addQuotes } from './utils/add-quotes';
import { splitAttributeValue } from './utils/split-attribute-value';
import { Asciidoctor } from '@asciidoctor/core';
import Inline = Asciidoctor.Inline;
import AttributeEntry = Asciidoctor.Document.AttributeEntry;

export class InlineNodeRenderer<T extends Inline> extends BaseNodeRenderer<T> {
  render(node: Inline): string {
    return node.getText();
  }

  protected renderAttributes(attributes: AttributeEntry[]): string {
    const shortenAttributes = this.shortenAttributes(attributes);
    const content = shortenAttributes
      .map(it => this.renderAttribute(it))
      .filter(it => !!it).join(',');
    return content ?? '';
  }

  protected renderAttribute(attr: AttributeEntry): string {
    const value = addQuotes(attr.name);
    if (attr.name === 'id') {
      return `#${value}`;
    } else if (attr.name === 'options') {
      return splitAttributeValue(attr.name).map(it => `%${addQuotes(it)}`).join('');
    } else if (attr.position) {
      return value?.toString();
    } else {
      return `${attr.name}=${value}`;
    }
  }

  // 简写 id 和 options 属性，把它们添加特定的前缀，然后追加到第一个位置参数后面
  private shortenAttributes(attributes: AttributeEntry[]): AttributeEntry[] {
    const id = attributes.find(it => it.name === 'id');
    const options = attributes.find(it => it.name === 'options');

    const idText = id && this.renderAttribute(id);
    const optionsText = options && this.renderAttribute(options);
    const firstPositionalAttribute = attributes.find(it => it.position === 1);
    return attributes
      .filter(it => !!it)
      .filter(it => !firstPositionalAttribute?.value || ![id, options].includes(it))
      .map((it) => it.name === firstPositionalAttribute?.name ? {
        ...it,
        value: [it.value, idText, optionsText].filter(it => !!it).join(''),
      } : it);
  }
}
