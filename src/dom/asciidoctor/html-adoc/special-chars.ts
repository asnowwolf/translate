export class SpecialChars {
  static encodeAttribute(text: string): string {
    return text.replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  static encodeText(text: string) {
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  static encodeUrl(text: string): string {
    return encodeURI(this.decodeText(text));
  }

  static decodeText(text: string): string {
    return text.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }

  static decodeAttribute(text: string): string {
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'');
  }

  static decodeUrl(text: string): string {
    return decodeURI(text);
  }
}
