import { AdocConverter } from '../../adoc-converter';

export interface RawAttributes {
  $$keys: (string | { key: number, key_hash: number, value: string })[];
}

export type AttributeValue = string | number;

export interface NodeAttributes {
}

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

type ContentModel = 'empty' | 'simple' | 'compound' | 'raw' | 'verbatim';

export interface AbstractBlockNode extends AbstractNode {
  append(block: AbstractBlockNode): void;

  applySubstitutions(text: string, subs: string[]): string;

  getTitle(): string;

  getCaptainedTitle(): string;

  getStyle(): string;

  getCaption(): string;

  setCaption(caption: string): void;

  getLevel(): number;

  getSubstitutions(): string[];

  hasSubstitution(substitution: string): boolean;

  removeSubstitution(substitution: string): void;

  hasBlocks(): boolean;

  getBlocks(): AbstractBlockNode[];

  getContent(): string;

  convert(options?: { [key: string]: AttributeValue }): string;

  findBy(selector: string, block: boolean): AbstractNode[];

  getLineNumber(): number;

  hasSections(): boolean;

  getSections(): AbstractBlockNode[];

  getNumeral(): string;

  setNumeral(numeral: string): void;

  hasTitle(): boolean;

  content_model: ContentModel;

  source_location: string;

  subs: string[];

  xreftext: string;

  lines: string[];
}

export interface BlockNode extends AbstractBlockNode {
  blockname: string;

  content: string;

  lines: string[];

  getSource(): string;

  getSourceLines(): string[];
}

interface Callout {
  $$smap: { ordinal: number, id: string };
}

export interface Callouts {
  $callout_ids(li_ordinal: number): string[];

  $current_list(): Callout[];

  $next_list(): Callout[];
}

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

  getHeader(): string;

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

export interface Reader {
  getLines(): string[];

  getString(): string;

  file: string;

  dir: string;

  path: string;

  lineno: number;

  source_lines: string[];

  process_lines: string[];

  unterminated: boolean;

  $prepare_lines(data: any, options: any): void;

  $process_ine(line: any): void;
}

export interface InlineNode extends AbstractNode {
  convert(): string;

  getText(): string;

  getType(): string;

  getTarget(): string;

  $render(): string;

  alt: string;

  reftext: string;
}

export interface ListItemNode extends InlineNode {
  getBlocks(): AbstractBlockNode[];

  setText(text: string): void;

  list: ListNode;

  marker: string;
}

export interface ListNode extends AbstractBlockNode {
  getTitle(): string;

  getItems(): ListItemNode[];

  $content: string;

  $render(): string;
}

export interface SectionNode extends AbstractBlockNode {
  getIndex(): number;

  setIndex(index: number): void;

  getSectionName(): string;

  setSectionName(name: string): void;

  isSpecial(): boolean;

  setSpecial(special: boolean): void;

  isNumbered(): boolean;

  getName(): string;
}

export interface TableNode extends AbstractBlockNode {
  rows: Rows;

  columns: ColumnNode[];

  has_header_option: boolean;

  caption: string;
}

export interface Rows {
  head: CellNode[][];

  body: CellNode[][];

  foot: CellNode[][];
}

export interface ColumnNode extends AbstractNode {
  style: string;

  table: TableNode;

  $assign_width(col_pcwidth, width_base, pf): void;
}

export interface CellNode extends AbstractNode {
  source_location: any;

  style: string;

  subs: string[];

  colspan: number;

  rowspan: number;

  column: ColumnNode;

  inner_document: DocumentNode;

  text: string;

  content: string;

  file: string;

  lineno: number;
}
