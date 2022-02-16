import { toText } from './to-text';

export function addQuotes(content: string | object): string {
  const text = toText(content);
  if (text?.includes(',') || text?.includes('"')) {
    return JSON.stringify(text);
  } else {
    return toText(text);
  }
}
