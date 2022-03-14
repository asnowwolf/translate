import { Asciidoctor } from '@asciidoctor/core';
import { Adoc } from '../../utils/adoc';
import { AdocNodeRenderer } from '../../utils/adoc-node-renderer';
import { matchSome } from '../../adoc-builder/renderers/utils/match-some';
import { omit, uniq } from 'lodash';

function valueToText(value: number | string | object[] | object): string {
  if (typeof value === 'number' || typeof value === 'string') {
    return `${value}`;
  } else if (!value || !value.toString()) {
    return '';
  } else if ('length' in value) {
    return JSON.stringify(Array.from(value).map(it => {
      if (it instanceof Object) {
        return omit(it, '$$id');
      } else {
        return it;
      }
    }));
  } else if (typeof value === 'object') {
    return JSON.stringify(omit(value, '$$id'));
  }
}

export type Attribute = { name: string, value: any, prefix: 'data' | 'attr' | 'adoc' | 'prop' };

export abstract class BaseTinyNodeRenderer<T extends Asciidoctor.AbstractNode> implements AdocNodeRenderer<T> {
  protected readonly ignoredAttributeNames: readonly (string | RegExp)[] = [];

  protected readonly tagName: string = 'UNKNOWN';

  protected readonly selfClosingTag: boolean = false;

  protected getTagName(node: T): string {
    return this.tagName;
  }

  render(node: T): string {
    if (this.selfClosingTag) {
      return `<${this.getTagName(node)}${this.renderAttributes(node)}/>`;
    } else {
      return `<${this.getTagName(node)}${this.renderAttributes(node)}>${this.getContent(node) ?? ''}</${this.getTagName(node)}>`;
    }
  }

  protected renderAttributes(node: T): string {
    function shouldIgnore(name: string, node: T): boolean {
      return name === 'style' || Adoc.isDocument(node) && !matchSome(name, [
        'doctitle',
        'authorcount',
        'firstname',
        'authorinitials',
        'middlename',
        'lastname',
        'author',
        'email',
        'authors',
        /firstname_(\d+)/,
        /authorinitials_(\d+)/,
        /lastname_(\d+)/,
        /author_(\d+)/,
        /author_(\d+)/,
        /authorinitials_(\d+)/,
        /firstname_(\d+)/,
        /middlename_(\d+)/,
        /lastname_(\d+)/,
        /email_(\d+)/,
        'revnumber',
        'revdate',
        ...node.attributes_modified.hash.$$keys,
      ]);
    }

    const result = [
      {
        name: 'name',
        prefix: 'adoc',
        value: node.getNodeName(),
      },
      ...this.getAttributesViaSetter(node),
      ...this.getAttributesViaProperty(node).filter(it => !shouldIgnore(it.name, node)),
    ]
      .filter(it => !!it)
      .map(({ name, value, prefix }) => {
        const valueText = valueToText(value).replace(/"/g, '&quot;');
        if (typeof value === 'string') {
          return `${prefix}-${name}="${valueText}"`;
        } else if (value === undefined || value === null || typeof value === 'object' && value.toString() === '' || typeof value === 'number' && value === 0) {
          return '';
        } else {
          return `${prefix}-${name}="${valueText}" type-${prefix}-${name}="${typeof value}"`;
        }
      }).filter(it => !!it).join(' ');
    return result && ` ${result}`;
  }

  protected getAttributesViaProperty(node: T): Attribute[] {
    const normalAttributes = Object.entries(node.getAttributes())
      .filter(([name]) => !matchSome(name, ['$positional', ...this.ignoredAttributeNames]))
      .map(([name, value]) => ({ name, value, prefix: 'data' }))
      .filter(it => it.value !== undefined) as Attribute[];
    if (Adoc.isInline(node)) {
      return [
        ...normalAttributes,
        { name: 'type', value: node.getType(), prefix: 'prop' },
        { name: 'alt', value: node.getAlt(), prefix: 'prop' },
        { name: 'target', value: node.getTarget(), prefix: 'prop' },
      ].filter(it => it.value !== undefined) as Attribute[];
    } else {
      return normalAttributes;
    }
  }

  private getAttributesViaSetter(node: T): Attribute[] {
    function getSetterNames(obj: object): string[] {
      if (!obj) {
        return [];
      }
      return uniq([...Object.getOwnPropertyNames(obj), ...getSetterNames(Object.getPrototypeOf(obj))]);
    }

    const setters = getSetterNames(node)
      .filter(it => /^set([A-Z])\w+/.test(it))
      .filter(it => !Adoc.isDocument(node) || it !== 'setTitle')
      .filter(it => !['setAttribute', 'setHeaderAttribute', 'setSourcemap'].includes(it));

    return setters.map(it => {
      const name = it.replace(/^set([A-Z]\w*)/, '$1');
      const value = node[`get${name}`]?.();
      return { name, value, prefix: 'attr' };
    }).filter(it => !!it?.value) as Attribute[];
  }

  protected getContent(node: T): string {
    if (Adoc.isAbstractBlock(node)) {
      return node.getContent();
    } else if (Adoc.isInline(node)) {
      return node.getText();
    }
  }
}
