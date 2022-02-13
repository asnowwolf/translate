interface RawAttributes {
  $$keys: (string | { key: number, key_hash: number, value: string })[];
}

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

  attributes: RawAttributes;
}

export interface AdocAttribute {
  name: string;
  value: string;
  positional: boolean;
}
