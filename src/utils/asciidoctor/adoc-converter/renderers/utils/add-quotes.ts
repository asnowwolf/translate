export function addQuotes(content: string | object): string {
  if (typeof content === 'object') {
    if (content.constructor.name === '$NilClass') {
      return '';
    } else {
      return JSON.stringify(content);
    }
  } else if (typeof content === 'string') {
    if (content?.includes(',') || content?.includes('"')) {
      return JSON.stringify(content);
    } else {
      return content ?? '';
    }
  } else {
    return content;
  }
}
