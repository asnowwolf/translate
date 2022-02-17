import { BaseNodeRenderer } from './base-node-renderer';
import { addQuotes } from './utils/add-quotes';
import { splitAttributeValue } from './utils/split-attribute-value';
import { AbstractBlockNode, AbstractNode, AttributeEntry } from './dom/models';

export class BlockNodeRenderer<T extends AbstractBlockNode> extends BaseNodeRenderer<T> {
  render(node: T): string {
    const header = this.renderHeader(node);
    const body = this.renderBody(node);
    return [header, body].filter(it => !!it).join('\n');
  }

  protected renderHeader(node: T): string {
    const attributes = this.renderAttributes(this.getBlockAttributes(node));
    return [
      attributes ? `[${attributes}]` : '',
      this.buildBlockTitle(this.getBlockTitle(node)?.toString()),
    ].filter(it => !!it).join('\n');
  }

  protected getBlockTitle(node: T) {
    return node.getAttribute('title');
  }

  protected renderBody(node: T): string {
    return `${this.renderChildren(node)}\n`;
  }

  protected buildBlockTitle(title: string): string {
    const blockTitle = title?.trim();
    return blockTitle && `.${blockTitle}`;
  }

  protected renderChildren(node: T): string {
    const content = node.getContent?.();
    return renderContent(content);
  }

  protected renderAttributes(attributes: AttributeEntry[]): string {
    const shortenAttributes = this.shortenAttributes(attributes);
    const content = shortenAttributes
      .map(it => this.renderAttribute(it))
      .filter(it => !!it).join(', ');
    return content ?? '';
  }

  protected renderAttribute(attr: AttributeEntry): string {
    const value = addQuotes(attr.value);
    if (attr.name === 'id') {
      return `#${value}`;
    } else if (attr.name === 'options') {
      return splitAttributeValue(attr.value).map(it => `%${addQuotes(it)}`).join('');
    } else if (attr.name === 'role') {
      return splitAttributeValue(attr.value).map(it => `.${addQuotes(it)}`).join('');
    } else if (attr.position) {
      return value.toString();
    } else {
      return `${attr.name}=${value}`;
    }
  }

  // 简写 id 和 options 属性，把它们添加特定的前缀，然后追加到第一个位置参数后面
  private shortenAttributes(attributes: AttributeEntry[]): AttributeEntry[] {
    const id = attributes.find(it => it.name === 'id');
    const options = attributes.find(it => it.name === 'options');
    const role = attributes.find(it => it.name === 'role');

    const idText = id && this.renderAttribute(id);
    const optionsText = options && this.renderAttribute(options);
    const roleText = role && this.renderAttribute(role);
    const firstPositionalAttribute = attributes.find(it => it.position === 1);
    return attributes
      .filter(it => !!it)
      .filter(it => !firstPositionalAttribute?.value || ![id, options, role].includes(it))
      .map((it) => it.name === firstPositionalAttribute?.name ? {
        ...it,
        value: [it.value, idText, optionsText, roleText].filter(it => !!it).join(''),
      } : it);
  }
}

export function renderContent(content: string | AbstractNode | AbstractBlockNode | AbstractNode[] | AbstractNode[][]): string {
  if (!content || content.constructor.name === '$NilClass') {
    return '';
  }

  if (typeof content === 'string') {
    return content;
  }
  if ('convert' in content) {
    return content.convert();
  } else if (content instanceof Array) {
    return (content as [AbstractNode | AbstractNode[]]).map(it => renderContent(it))
      .filter(it => !!it).join('\n');
  }
}
