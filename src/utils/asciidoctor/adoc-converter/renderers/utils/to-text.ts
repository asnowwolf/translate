export function toText(content: string | object): string {
  if (typeof content === 'object') {
    if (content.constructor.name === '$NilClass') {
      return '';
    } else {
      return JSON.stringify(content);
    }
  } else if (typeof content === 'string') {
    return content;
  } else {
    return '';
  }
}
