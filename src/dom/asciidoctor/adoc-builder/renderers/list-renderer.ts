import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import List = Asciidoctor.List;

export class ListRenderer extends BlockNodeRenderer<List> {
  positionalAttributes = [{ name: 'style', position: 1 }];
  ignoredAttributeNames = ['checklist-option'];

  getDefaultAttributes(node: List): { [key: string]: any } {
    return { style: 'arabic' };
  }

  protected getBlockTitle(node: List): string {
    return node.getTitle();
  }
}
