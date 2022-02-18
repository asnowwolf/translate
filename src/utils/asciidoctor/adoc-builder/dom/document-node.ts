import { AbstractBlockNode } from './abstract-block-node';
import { AttributeValue } from './attribute-value';
import { Callouts } from './callouts';
import { Reader } from './reader';
import { SectionNode } from './section-node';

interface DocumentCatalog {
}

export interface DocumentNode extends AbstractBlockNode {
  getIds(): string[];

  getRefs(): string[];

  getImages(): string[];

  getIndexTerms(): string[];

  getLinks(): string[];

  hasFootnotes(): boolean;

  getFootnotes(): string[];

  getHeader(): SectionNode;

  write(output: string, target: string): void;

  getAuthor(): Author;

  getSource(): string;

  getSourceLines(): string[];

  isNested(): boolean;

  isEmbedded(): boolean;

  hasExtensions(): boolean;

  getDoctype(): string;

  getBackend(): string;

  isBasebackend(base: any): boolean;

  setTitle(title: string): void;

  getDocumentTitle(options: { [key: string]: AttributeValue }): string;

  getDoctitle(options: { [key: string]: AttributeValue }): string;

  getCatalog(): DocumentCatalog;

  getReferences(): any[];

  getRevisionDate(): any;

  getRevdate(): any;

  getRevisionNumber(): string;

  getRevisionRemark(): string;

  setHeaderAttribute(name: string, value: AttributeValue, overwrite: boolean): void;

  getAuthors(): Author[];

  getRevisionInfo(): any;

  hasRevisionInfo(): boolean;

  getNotitle(): boolean;

  getNoheader(): boolean;

  getNofooter(): boolean;

  hasHeader(): boolean;

  deleteAttribute(name: string): void;

  isAttributeLocked(name: string): boolean;

  parse(data: string): any;

  getDocinfo(docinfoLocation: string, suffix: any): string;

  hasDocinfoProcessors(docinfoLocation: string): boolean;

  counterIncrement(counterName: string, block: boolean): void;

  counter(name: string, seed: number): number;

  getSafe(): boolean;

  getCompatMode(): boolean;

  getSourcemap(): any;

  getCounters(): any[];

  getCallouts(): Callouts;

  getBaseDir(): string;

  getOptions(): { [key: string]: AttributeValue };

  getOutfilesuffix(): string;

  getParentDocument(): DocumentNode;

  getReader(): Reader;

  getExtensions(): any[];
}

export interface ImageReference {
  getTarget(): string;

  getImagesDirectory(): string;
}

export interface Footnote {
  getIndex(): number;

  getId(): string;

  getText(): string;

}

export interface AttributeEntry {
  name: string;

  value: AttributeValue;

  negate?: boolean;

  // 自定义属性
  position?: number;
}

export interface Title {
  getMain(): string;

  getCombined(): string;

  getSubtitle(): string;

  isSanitized(): boolean;

  hasSubtitle(): boolean;

}

export interface Author {
  getName(): string;

  getFirstName(): string;

  getMiddleName(): string;

  getLastName(): string;

  getInitials(): string;

  getEmail(): string;

}
