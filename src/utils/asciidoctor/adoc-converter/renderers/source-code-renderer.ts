import { AdocNode } from './adoc-node';
import { BlockNodeRenderer } from './block-node-renderer';
import { needDelimiter } from './utils/need-delimiter';

interface SourceCodeNode extends AdocNode {
  getStyle(): string;
}

function getDelimiter(style: string): string {
  switch (style) {
    case 'source':
      return '----';
    case 'literal':
      return '....';
    case 'listing':
      return '----';
    default:
      return '====';
  }
}

function needStyleAttribute(style: string, node: SourceCodeNode) {
  return style === 'source' || style === 'literal' && !needDelimiter(node);
}

export class SourceCodeRenderer extends BlockNodeRenderer<SourceCodeNode> {
  positionalAttributes = [{ name: 'style', position: 1 }, { name: 'language', position: 2 }];

  getDefaultAttributes(node: SourceCodeNode): { [key: string]: any } {
    const style = node.getStyle();
    return { style: needStyleAttribute(style, node) ? '' : style, 'linenums-option': '', linenums: '' };
  }

  protected renderBody(node: SourceCodeNode): string {
    const children = node.lines
      .map(it => ' '.repeat(+node.getAttribute('indent')) + it)
      .join('\n');
    const delimiter = !needDelimiter(node) ? '' : getDelimiter(node.getStyle());
    return [delimiter, children, delimiter].filter(it => !!it).join('\n');
  }
}
