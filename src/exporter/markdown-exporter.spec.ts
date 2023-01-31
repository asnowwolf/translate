import { MarkdownExporter } from './markdown-exporter';

describe('markdown exporter', () => {
  it('should remove inline crlf', () => {
    const exporter = new MarkdownExporter();
    const result = exporter.exportContent(``);
    expect(result).toEqual(``);
  });
});
