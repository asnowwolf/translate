import { AttributeValue } from '../dom/models';

export function splitAttributeValue(attributeValue: AttributeValue): string[] {
  if (typeof attributeValue === 'string') {
    return attributeValue.split(',').map(it => it.trim());
  } else {
    return [attributeValue.toString()];
  }
}
