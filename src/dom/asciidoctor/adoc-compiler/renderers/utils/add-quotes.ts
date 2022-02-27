import { AttributeValue } from './attribute-value';

export function addQuotes(content: AttributeValue): string | number {
  if (typeof content === 'string') {
    if (content?.includes(',') || content?.includes('"')) {
      return JSON.stringify(content);
    }
  }
  return content;
}
