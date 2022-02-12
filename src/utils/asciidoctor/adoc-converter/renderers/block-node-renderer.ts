import { addQuotes } from '../utils/add-quotes';

export interface AdocNode {
  getContent(): string | any;

  getNodeName(): string;

  getAttributes(): Record<string, any>;

  getAttribute(name: string): string;

  getTitle(): string;

  getText(): string;

  convert(): string;

  blocks: AdocNode[];

  attributes: { $$keys: (string | { key: number, value: string })[] };
}

export interface NodeRenderer<T extends AdocNode> {
  render(node: T): string;
}

export class BlockNodeRenderer<T extends AdocNode> implements NodeRenderer<T> {
  defaultAttributes: { [name: string]: any } = {};
  ignoredAttributes: string[] = [];

  render(node: T): string {
    const header = this.renderHeader(node);
    const body = this.renderBody(node);
    const children = this.renderChildren(node);
    return [[header, body].filter(it => !!it).join('\n'), children].filter(it => !!it).join('\n');
  }

  protected renderHeader(node: T): string {
    const $$keys = node.attributes.$$keys;
    const attributes = $$keys.map(($$key) => {
      if (typeof $$key === 'string') {
        return { positional: false, name: $$key, value: node.getAttribute($$key) };
      } else {
        const { value } = $$key;
        return { positional: true, name: undefined, value };
      }
    });
    const nonDefaultAttributes = attributes.filter(({ positional, name, value }) =>
      !['title', ...this.ignoredAttributes].includes(name) && this.defaultAttributes[name] !== value);

    const attributesText = this.renderAttributes(nonDefaultAttributes);
    return [
      attributesText,
      this.buildBlockTitle(this.getBlockTitle(node)),
    ].filter(it => !!it?.trim()).join('\n');
  }

  protected getBlockTitle(node: T) {
    return node.getAttribute('title');
  }

  protected renderBody(node: T): string {
    return '';
  }

  protected buildBlockTitle(title: string): string {
    const blockTitle = title?.trim();
    return blockTitle && `.${blockTitle}`;
  }

  protected renderAttributes(attributes: { positional: boolean, name: string, value: any }[]): string {
    const content = attributes
      .map(({ value, name, positional }) => {
        const escapedValue = addQuotes(value);
        return positional ? escapedValue : `${name}=${escapedValue}`;
      })
      .join(',');
    return content ? `[${content}]` : '';
  }

  protected renderChildren(node: T): string {
    const content = node.getContent?.();
    return renderContent(content);
  }
}

function renderContent(content: string | AdocNode | AdocNode[] | AdocNode[][]): string {
  if (!content || content.constructor.name === '$NilClass') {
    return '';
  }

  if (typeof content === 'string') {
    return content;
  }
  if ('convert' in content) {
    return content.convert();
  } else if (content instanceof Array) {
    return (content as [AdocNode | AdocNode[]]).map(it => renderContent(it))
      .filter(it => !!it).join('\n');
  }
}
