import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import { adoc } from '../../utils/adoc';
import List = Asciidoctor.List;
import AbstractNode = Asciidoctor.AbstractNode;

function getLevelOf(node: AbstractNode): number {
  if (adoc.isList(node)) {
    return getLevelOf(node.getParent()) + 1;
  } else if (adoc.isDocument(node)) {
    return -1;
  } else {
    return getLevelOf(node.getParent());
  }
}

const defaultStyles = ['arabic', 'loweralpha', 'lowerroman', 'upperalpha', 'upperroman'];

export class ListRenderer extends BlockNodeRenderer<List> {
  ignoredAttributeNames = ['checklist-option'];

  getDefaultAttributes(node: List): { [key: string]: any } {
    const level = getLevelOf(node);
    return { style: defaultStyles[level] ?? 'arabic' };
  }

  protected getBlockTitle(node: List): string {
    return node.getTitle();
  }
}
