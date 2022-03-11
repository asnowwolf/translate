import { BaseNodeRenderer } from './base-node-renderer';
import { addQuotes } from './utils/add-quotes';
import { splitAttributeValue } from './utils/split-attribute-value';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractBlock = Asciidoctor.AbstractBlock;
import AttributeEntry = Asciidoctor.Document.AttributeEntry;
import AbstractNode = Asciidoctor.AbstractNode;

export class BlockNodeRenderer<T extends AbstractBlock> extends BaseNodeRenderer<T> {
  render(node: T): string {
    const header = this.renderHeader(node);
    const body = this.renderBody(node);
    return [header, body].filter(it => !!it).join('\n');
  }

  protected renderHeader(node: T): string {
    const attributes = this.renderAttributes(this.getBlockAttributes(node) as AttributeEntry[]);
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
      .map(it => this.renderAttribute(it, shortenAttributes))
      .filter(it => !!it).join(',');
    return content ?? '';
  }

  protected renderAttribute(attr: AttributeEntry, attributes: AttributeEntry[] = []): string {
    const value = addQuotes(attr.value);
    if (attr.name === 'id') {
      return attributes.length > 1 ? `#${value}` : `[${value}]`;
    } else if (optionNamePattern.test(attr.name)) {
      const optionName = attr.name.replace(optionNamePattern, '$1');
      return `%${addQuotes(optionName)}`;
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
    const options = attributes.find(it => optionNamePattern.test(it.name));
    const role = attributes.find(it => it.name === 'role');

    const firstPositionalAttribute = attributes.find(it => it.position === 1);
    const idText = id && this.renderAttribute(id, attributes);
    const optionsText = options && this.renderAttribute(options, attributes);
    const roleText = role && this.renderAttribute(role, attributes);
    return attributes
      .filter(it => !!it)
      .filter(it => !firstPositionalAttribute?.value || ![id, options, role].includes(it))
      .map((it) => it.name === firstPositionalAttribute?.name ? {
        ...it,
        value: [it.value, idText, optionsText, roleText].filter(it => !!it).join(''),
      } : it);
  }
}

export function renderContent(content: string | AbstractNode | AbstractBlock | AbstractNode[] | AbstractNode[][]): string {
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

const optionNamePattern = /^(.*?)-option$/;
