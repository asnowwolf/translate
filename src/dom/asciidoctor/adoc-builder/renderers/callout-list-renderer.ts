import { BlockNodeRenderer } from './block-node-renderer';
import { Asciidoctor } from '@asciidoctor/core';
import List = Asciidoctor.List;

export class CalloutListRenderer extends BlockNodeRenderer<List> {
  protected getDefaultAttributes(node: List): { [p: string]: any } {
    return { style: 'arabic' };
  }
}
