import { AdocNode } from './adoc-node';

export interface NodeRenderer<T extends AdocNode> {
  render(node: T): string;
}
