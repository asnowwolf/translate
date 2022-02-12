export interface AdocNode {
  getId(): string;

  getParent(): AdocNode;

  getContent(): string | any;

  getNodeName(): string;

  getAttributes(): Record<string, any>;

  getAttribute(name: string): string;

  getTitle(): string;

  getText(): string;

  getType(): string;

  convert(): string;

  blocks: AdocNode[];

  attributes: { $$keys: (string | { key: number, value: string })[] };
}
