import { BaseNodeRenderer } from './base-node-renderer';
import { AdocAttribute, AdocNode } from './adoc-node';
import { addQuotes } from './utils/add-quotes';

interface InlineNode extends AdocNode {

}

export class InlineNodeRenderer<T extends AdocNode> extends BaseNodeRenderer<T> {
  render(node: InlineNode): string {
    return node.getText();
  }

  protected renderAttributes(attributes: AdocAttribute[]): string {
    const shortenAttributes = this.shortenAttributes(attributes);
    const content = shortenAttributes
      .map(it => this.renderAttribute(it))
      .filter(it => !!it).join(', ');
    return content ?? '';
  }

  protected renderAttribute(attr: AdocAttribute): string {
    const value = addQuotes(attr.value);
    if (attr.name === 'id') {
      return `#${value}`;
    } else if (attr.name === 'options') {
      return attr.value.split(',').map(it => `%${addQuotes(it)}`).join(',');
    } else if (attr.position) {
      return value;
    } else {
      return `${attr.name}=${value}`;
    }
  }

  // 简写 id 和 options 属性，把它们添加特定的前缀，然后追加到第一个位置参数后面
  private shortenAttributes(attributes: AdocAttribute[]): AdocAttribute[] {
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
