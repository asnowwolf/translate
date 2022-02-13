export function addQuotes(content: string): string {
  if (content.includes(',') || content.includes('"')) {
    return JSON.stringify(content);
  } else {
    return content;
  }
}
