import { DomElement } from './tiny-dom/dom-models';

export enum TranslationEngineType {
  google = 'google',
  gcloud = 'gcloud',
  ms = 'ms',
  dict = 'dict',
  fake = 'fake',
  noop = 'noop',
}

export function containsChinese(text?: string): boolean {
  if (!text) {
    return false;
  }
  return text.search(/[\u4e00-\u9fa5]/gm) !== -1;
}

const elementSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 't'].map(it => (node: DomElement) => node.isTagOf(it));
const attributeSelector = (node: DomElement) => node.hasAttribute('ng-should-translate');
export const defaultSelectors = [...elementSelectors, attributeSelector];
