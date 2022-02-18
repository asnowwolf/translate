import { NodeAttributes } from './node-attributes';
import { AttributeValue } from './attribute-value';
import { AdocConverter } from '../renderers/adoc-converter';
import { RawAttributes } from './raw-attributes';
import { DocumentNode } from './document-node';

export interface AbstractNode {
  getNodeName(): string;

  getAttributes<T extends NodeAttributes>(): T;

  getAttribute(key: string, defaultValue?: AttributeValue, inherit?: boolean): AttributeValue;

  hasAttribute(name: string): boolean;

  isAttribute(name: string, expectedValue?: AttributeValue, inherit?: boolean): boolean;

  setAttribute(name: string, value: AttributeValue, overwrite?: boolean): void;

  removeAttribute(name: string): void;

  getDocument(): DocumentNode;

  getParent(): AbstractNode;

  isInline(): boolean;

  isBlock(): boolean;

  isRole(expected: string): boolean;

  getRole(): string;

  hasRole(name: string): boolean;

  getRoles(): string[];

  addRole(name: string): void;

  removeRole(name: string): void;

  isReftext(): boolean;

  getReftext(): string;

  getContext(): string;

  getId(): string;

  isOption(name: string): boolean;

  setOption(name: string): void;

  getIconUri(name: string): string;

  getMediaUri(target: string, assetDirKey: string): string;

  getImageUri(targetImage: string, assetDirKey: string): string;

  getConverter(): AdocConverter;

  readContents(target: AbstractNode, options: { [key: string]: AttributeValue }): string;

  readAsset(path: string, options: { [key: string]: AttributeValue }): string;

  normalizeWebPath(target: string, start, preserveTargetUri: boolean): string;

  normalizeSystemPath(target: string, start, jail: string, preserveTargetUri: boolean): string;

  attributes: RawAttributes;
}
