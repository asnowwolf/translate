interface RawAttributes {
  $$keys: (string | { key: number, key_hash: number, value: string })[];
}

export interface AdocNode {
  getId(): string;

  getDocument(): AdocDocument;

  getParent(): AdocNode;

  getContent(): string | any;

  getNodeName(): string;

  getAttributes(): Record<string, any>;

  getAttribute(name: string): string;

  getTitle(): string;

  getLevel(): number;

  getText(): string;

  getType(): string;

  convert(): string;

  getBlocks(): AdocNode[];

  lines: string[];

  content_model: 'simple' | 'compound' | 'verbatim';

  attributes: RawAttributes;
}

export interface AdocDocument extends AdocNode {
  idMap?: { [key: string]: AdocNode }; // 自定义属性
}

export interface AdocAttribute {
  name: string;
  value: string;
  position?: number;
}
