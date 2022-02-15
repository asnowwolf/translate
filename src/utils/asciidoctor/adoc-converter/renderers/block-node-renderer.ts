import { BaseNodeRenderer } from './base-node-renderer';
import { AdocNode } from './adoc-node';

export class BlockNodeRenderer<T extends AdocNode> extends BaseNodeRenderer<T> {
  render(node: T): string {
    const header = this.renderHeader(node);
    const body = this.renderBody(node);
    return [header, body].filter(it => !!it).join('\n');
  }

  protected renderHeader(node: T): string {
    const attributes = this.renderAttributes(this.getBlockAttributes(node));
    return [
      attributes ? `[${attributes}]` : '',
      this.buildBlockTitle(this.getBlockTitle(node)),
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
