import * as remarkParse from 'remark-parse';
import * as remarkStringify from 'remark-stringify';
import * as rehypeParse from 'rehype-parse';
import * as remarkHtml from 'remark-html';
import * as rehypeRemark from 'rehype-remark';
import * as frontmatter from 'remark-frontmatter';
import * as unified from 'unified';
import { VFileCompatible } from 'unified';
import { Node } from 'unist';
import * as stringWidth from 'string-width';

const stringifyOptions = {
  emphasis: '*',
  listItemIndent: 1,
  incrementListMarker: false,
  stringLength: stringWidth,
  paddedTable: false,
  fences: true,
  entities: false,
};

export function markdownParse(markdown: VFileCompatible): Node {
  return unified().use(remarkParse)
    .use(frontmatter)
    .parse(markdown);
}

export function markdownStringify(tree: Node): string {
  return unified().use(remarkStringify, stringifyOptions)
    .use(frontmatter)
    .stringify(tree);
}

export function markdownToHtml(ast: Node): string {
  return unified().use(remarkParse)
    .use(frontmatter)
    .use(remarkHtml)
    .processSync(markdownStringify(ast)).contents.toString();
}

export function markdownFromHtml(html: string): Node {
  const markdown = unified().use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkStringify, stringifyOptions)
    .processSync(html);
  return markdownParse(markdown);
}

export function mdToHtml(md: string): string {
  if (!md) {
    return md;
  }
  const html = markdownToHtml(markdownParse(md));
  return html.trim().replace(/^<p>([\s\S]*?)<\/p>$/gi, '$1');
}

export function htmlToMd(html: string): string {
  if (!html) {
    return html;
  }
  return markdownStringify(markdownFromHtml(html));
}
