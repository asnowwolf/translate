import * as remarkParse from 'remark-parse';
import * as remarkStringify from 'remark-stringify';
import * as rehypeParse from 'rehype-parse';
import * as remarkHtml from 'remark-html';
import * as rehypeRemark from 'rehype-remark';
import * as frontmatter from 'remark-frontmatter';
import * as unified from 'unified';
import { VFileCompatible } from 'unified';
import * as unistMap from 'unist-util-flatmap';
import * as unistVisit from 'unist-util-visit';
import * as unistRemove from 'unist-util-remove';
import { Node } from 'unist';
import { concat, merge, Observable, of } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslationEngine } from './engine';
import { map, mapTo, switchMap, tap, toArray } from 'rxjs/operators';
import { containsChinese } from './common';
import { ListItem } from 'mdast';
import * as stringWidth from 'string-width';
import { safeDump, safeLoad } from 'js-yaml';

export namespace markdown {
  const stringifyOptions = {
    emphasis: '*',
    listItemIndent: 1,
    incrementListMarker: false,
    stringLength: stringWidth,
    paddedTable: false,
    fences: true,
    entities: false,
  };

  export function parse(markdown: VFileCompatible): Node {
    return unified().use(remarkParse)
      .use(frontmatter)
      .parse(markdown);
  }

  export function stringify(tree: Node): string {
    return unified().use(remarkStringify, stringifyOptions)
      .use(frontmatter)
      .stringify(tree);
  }

  export function mdToHtml(ast: Node): string {
    return unified().use(remarkParse)
      .use(frontmatter)
      .use(remarkHtml)
      .processSync(stringify(ast)).contents.toString('utf-8');
  }

  export function htmlToMd(html: string): Node {
    return parse(unified().use(rehypeParse).use(rehypeRemark).use(remarkStringify, stringifyOptions).processSync(html));
  }

  function shouldTranslate(root: Node): boolean {
    let result = true;
    unistVisit(root, (node) => {
      if (containsChinese(node.value)) {
        result = false;
      }
    });
    return result;
  }

  function translateNormalNode(node: Node, engine: TranslationEngine): Observable<Node> {
    return engine.translate(mdToHtml(preprocess(node))).pipe(
      map(html => htmlToMd(html)),
    );
  }

  export function translate(tree: Node, engine: TranslationEngine): Observable<Node> {
    const result = unistMap(tree, (node, _, parent) => {
      if ((node.type === 'paragraph' || node.type === 'tableRow' || node.type === 'heading') && shouldTranslate(node)) {
        return [node, markNode(cloneDeep<Node>(node), parent)];
      }
      return [node];
    });
    const pairs: Node[] = [];
    const yamls: Node[] = [];
    unistVisit(result, (node) => {
      if (node.translation) {
        pairs.push(node);
      }
      if (node.type === 'yaml') {
        yamls.push(node);
      }
    });
    const tasks = pairs.map(node => of(node).pipe(
      switchMap(node => translateNormalNode(node, engine)),
      tap(translation => {
        if (stringify(node) === stringify(translation)) {
          return unistRemove(tree, translation);
        }
      }),
      tap(translation => postprocess(node, translation)),
    ));
    const yamlTasks = yamls.map(node => translateYamlNode(node, engine));
    return merge(...tasks, ...yamlTasks).pipe(
      toArray(),
      mapTo(result),
    );
  }

  function translateYamlNode(node: Node, engine: TranslationEngine): Observable<void> {
    const frontMatter = safeLoad(node.value as string) || {};
    const result = {};
    const tasks = Object.entries<string>(frontMatter).map(([key, value]) => engine.translate(value).pipe(
      tap(translation => {
        result[`${key}$$origin`] = value;
        result[key] = translation;
      }),
    ));
    return concat(...tasks).pipe(
      toArray(),
      tap(() => node.value = safeDump(result)),
      mapTo(void 0),
    );
  }

  function preprocess(node: Node): Node {
    if (node.tableCell) {
      node.type = 'paragraph';
    }
    return node;
  }

  function postprocess(node: Node, translation: Node): Node {
    if (node.tableCell) {
      translation.type = 'tableCell';
    }
    Object.assign(node, translation);
    return node;
  }

  function markNode(root: Node, container: Node): Node {
    if (root.type === 'tableRow') {
      unistVisit(root, (node) => {
        if (node.type === 'tableCell') {
          node.translation = true;
          node.tableCell = true;
        }
      });
    } else {
      root.translation = true;
      if (container.type === 'listItem') {
        (container as ListItem).spread = true;
      }
    }
    return root;
  }
}
