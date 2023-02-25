import { MarkdownExporter } from './markdown-exporter';

describe('markdown exporter', () => {
  it('should remove inline crlf', () => {
    const exporter = new MarkdownExporter();
    const result = exporter.exportContent(`abc
def
ghi

- a
  a1
  a2
- b
`, { outputDir: '.', mono: false });
    expect(result).toEqual(`abc def ghi

- a a1 a2
- b`);
  });

  it('should export mono version', function () {
    const exporter = new MarkdownExporter();
    const result = exporter.exportContent(`# one

# 一

two

二

二二

two-2

- three

  三

| four |  five  |
| ---- | ---- |
| 四 |  五  |
| six |  seven  |
| 六 |  七  |

\`\`\`
const a = 1; // one
const a = 1; // 一
\`\`\`
`, { outputDir: '.', mono: true });
    expect(result).toEqual(`# 一

二

二二

two-2

- 三

| 四  | 五  |
| --- | --- |
| 六  | 七  |

\`\`\`
const a = 1; // 一
\`\`\``);
  });
});
