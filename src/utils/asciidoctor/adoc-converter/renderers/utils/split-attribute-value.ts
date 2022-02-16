import { toText } from './to-text';

export function splitAttributeValue(attributeValue: string) {
  return toText(attributeValue).split(',').map(it => it.trim());
}
