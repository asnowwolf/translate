import { BlockNodeRenderer } from './block-node-renderer';
import { needDelimiter } from './utils/need-delimiter';
import { Asciidoctor } from '@asciidoctor/core';
import AbstractNode = Asciidoctor.AbstractNode;
import Block = Asciidoctor.Block;

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

function needStyleAttribute(style: string, node: AbstractNode) {
  return style === 'source' || style === 'literal' && !needDelimiter(node);
}

export class SourceCodeRenderer extends BlockNodeRenderer<Block> {
  positionalAttributes = [{ name: 'style', position: 1 }, { name: 'language', position: 2 }, { name: 'linenums', position: 3 }];

  getDefaultAttributes(node: Block): { [key: string]: any } {
    const style = node.getStyle();
    return { style: needStyleAttribute(style, node) ? '' : style, linenums: '' };
  }

  protected renderBody(node: Block): string {
    const children = node.getSourceLines()
      .map(it => ' '.repeat(+node.getAttribute('indent')) + it)
      .join('\n');
    const delimiter = getDelimiter(node.getStyle());
    return [delimiter, children, delimiter].filter(it => !!it).join('\n') + '\n';
  }
}
