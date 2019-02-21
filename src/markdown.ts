import * as remarkParse from 'remark-parse';
import * as remarkStringify from 'remark-stringify';
import * as unified from 'unified';
import { VFileCompatible } from 'unified';
import * as unistMap from 'unist-util-flatMap';
import { Node } from 'unist';
import { concat, Observable, of } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslationEngine } from './engine';
import { map, mapTo, switchMap, tap, toArray } from 'rxjs/operators';

export namespace markdown {
  const processor = unified().use(remarkParse).use(remarkStringify);

  export function parse(markdown: VFileCompatible): Node {
    return processor.parse(markdown);
  }

  export function stringify(tree: Node): string {
    return processor.stringify(tree);
  }

  export function translate(tree: Node, engine: TranslationEngine): Observable<Node> {
    const result = unistMap(tree, (node, _, parent) => {
      if (node.type === 'paragraph' || node.type === 'tableRow' || node.type === 'heading') {
        return [node, markNode(node, parent)];
      }
      return [node];
    });
    const pairs: Node[] = [];
    unistMap(result, (node) => {
      if (node.translation) {
        pairs.push(node);
      }
      return [node];
    });
    const tasks = pairs.map(node => of(node));
    return concat(...tasks).pipe(
      switchMap(node => engine.translate(node.value as string).pipe(
        map(text => node.listItem ? `\n${text}\n` : text),
        tap(text => node.value = text),
      )),
      toArray(),
      mapTo(result),
    );
  }

  function markNode(root: Node, container: Node): Node {
    return unistMap(cloneDeep<Node>(root), (node: Node) => {
      if (node.type === 'text') {
        node.translation = true;
        node.listItem = container.type === 'listItem';
      }
      return [node];
    });
  }
}
