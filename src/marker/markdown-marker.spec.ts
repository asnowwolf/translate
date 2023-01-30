import { MarkdownMarker } from './markdown-marker';

describe('markdown marker', () => {
  it('should remove inline crlf', () => {
    const marker = new MarkdownMarker();
    const result = marker.markContent(``);
    expect(result).toEqual(``);
  });
});
