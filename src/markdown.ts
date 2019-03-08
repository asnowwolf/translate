import * as remarkParse from 'remark-parse';
import * as remarkStringify from 'remark-stringify';
import * as rehypeParse from 'rehype-parse';
import * as remarkHtml from 'remark-html';
import * as rehypeRemark from 'rehype-remark';
import * as unified from 'unified';
import { VFileCompatible } from 'unified';
import * as unistMap from 'unist-util-flatmap';
import * as unistVisit from 'unist-util-visit';
import * as unistRemove from 'unist-util-remove';
import { Node } from 'unist';
import { concat, Observable, of } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslationEngine } from './engine';
import { map, mapTo, switchMap, tap, toArray } from 'rxjs/operators';
import { containsChinese } from './common';
import { ListItem } from 'mdast';
import * as stringWidth from 'string-width';

export namespace markdown {
  const stringifyOptions = {
    emphasis: '*', listItemIndent: 1, incrementListMarker: false, stringLength: stringWidth,
  };

  export function parse(markdown: VFileCompatible): Node {
    return unified().use(remarkParse).parse(markdown);
  }

  export function stringify(tree: Node): string {
    return unified().use(remarkStringify, stringifyOptions).stringify(tree);
  }

  export function mdToHtml(ast: Node): string {
    return unified().use(remarkParse).use(remarkHtml).processSync(stringify(ast)).contents.toString('utf-8');
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

  export function translate(tree: Node, engine: TranslationEngine): Observable<Node> {
    const result = unistMap(tree, (node, _, parent) => {
      if (node.type === 'paragraph' || node.type === 'tableRow' || node.type === 'heading' && shouldTranslate(node)) {
        return [node, markNode(cloneDeep<Node>(node), parent)];
      }
      return [node];
    });
    const pairs: Node[] = [];
    unistVisit(result, (node) => {
      if (node.translation) {
        pairs.push(node);
      }
    });
    const tasks = pairs.map(node => of(node).pipe(
      switchMap(node => engine.translate(mdToHtml(preprocess(node)))),
      map(html => htmlToMd(html)),
      tap(translation => {
        if (stringify(node) === stringify(translation)) {
          return unistRemove(tree, translation);
        }
      }),
      tap(translation => postprocess(node, translation)),
    ));
    return concat(...tasks).pipe(
      toArray(),
      mapTo(result),
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
