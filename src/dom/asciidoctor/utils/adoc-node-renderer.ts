import { Asciidoctor } from '@asciidoctor/core';
import { AdocNodeTypes } from './adoc-node-types';
export import AbstractNode = Asciidoctor.AbstractNode;

export interface AdocNodeRenderer<T extends AbstractNode> {
  render(node: T): string;
}

export type AdocNodeRendererMap = { [K in keyof AdocNodeTypes]?: AdocNodeRenderer<AdocNodeTypes[K]> };
