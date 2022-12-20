import { AbstractTranslator } from './abstract-translator';
import { IndentationText, JSDocTag, JSDocTagStructure, Node, OptionalKind, Project, SourceFile, SyntaxKind } from 'ts-morph';
import { isDeepStrictEqual } from 'util';
import { MarkdownTranslator } from './markdown-translator';
import { TranslationOptions } from './translation-options';
import { intersection } from 'lodash';
import { delay } from '../dom/delay';

function getTagsWithAncestors(node: Node): JSDocTag[] {
  if (!node) {
    return [];
  }
  // 如果不是，就跳过这一层，直接返回父级的结果
  if (!Node.isJSDocableNode(node)) {
    return getTagsWithAncestors(node.getParent());
  }
  // 取当前节点的所有标记
  const tags = node.getJsDocs().map(it => it.getTags()).flat();
  // 合并当前节点的标记和父级节点的标记
  return [...tags, ...getTagsWithAncestors(node.getParent())];
}

function shouldTranslate(node: Node, options: TranslationOptions): boolean {
  if (!Node.isJSDocableNode(node)) {
    return false;
  }
  if (Node.isModifierableNode(node)) {
    if (node.hasModifier(SyntaxKind.PrivateKeyword)) {
      return false;
    }
  }
  const tags = getTagsWithAncestors(node).map(it => it.getTagName());
  return (!options.mustIncludesTags || intersection(tags, options.mustIncludesTags).length > 0) &&
    (!options.mustExcludesTags || intersection(tags, options.mustExcludesTags).length === 0);
}

function preprocess(text: string): string {
  return text.replace(/(```\w*\n)(.*?)(```\n)/gs, (_, leading, body, tailing) => {
    return `${leading}${body.replace(/@/g, '&commat;')}${tailing}`;
  });
}

function postprocess(text: string): string {
  return text.replace(/&commat;/g, '@');
}

function joinChineseLines(text: string): string {
  return text;
}

export class JsdocTranslator extends AbstractTranslator<SourceFile> {
  private markdownTranslator = new MarkdownTranslator(this.engine);

  parse(text: string): SourceFile {
    const project = new Project({ manipulationSettings: { indentationText: IndentationText.TwoSpaces } });
    return project.createSourceFile('placeholder.ts', preprocess(text));
  }

  serialize(doc: SourceFile): string {
    return postprocess(doc.getFullText());
  }

  async flush(): Promise<void> {
    await this.markdownTranslator.flush();
    return super.flush();
  }

  protected translateSentence(sentence: string): Promise<string> {
    return this.markdownTranslator.translateContent(sentence).then((result) => result);
  }

  translateDoc(doc: SourceFile, options: TranslationOptions): SourceFile {
    this.translateNode(doc, options).then(it => it as SourceFile);
    return doc;
  }

  async translateNode(node: Node, options: TranslationOptions): Promise<Node> {
    if (Node.isJSDocableNode(node) && shouldTranslate(node, options)) {
      const docs = node.getJsDocs();
      for (const doc of docs) {
        const structure = doc.getStructure();
        const tagTasks = structure.tags.map(tag => this.translateTag(tag));
        const origin = joinChineseLines((structure.description as string).trim());
        const descriptionTask = this.translateSentence(origin).then(translation => {
          if (translation.trim() !== origin.trim()) {
            structure.description = removeExtraBlankLines(translation);
          }
        });
        Promise.all([...tagTasks, descriptionTask].filter(it => !!it)).then(() => {
          if (!isDeepStrictEqual(structure, doc.getStructure())) {
            doc.set(structure);
          }
        });
      }
    }
    const children = Array.from(node.getChildren());
    children.forEach((subNode) => {
      this.translateNode(subNode, options);
    });
    return delay(1000).then(() => node);
  }

  translateTag(tag: OptionalKind<JSDocTagStructure>): Promise<void> | undefined {
    const text = tag.text as string;

    if (isBinaryTag(tag)) {
      const [, name, description] = (text ?? '').match(/^((?:{.*?}\s*)?(?:[\w.\[\]]+|\[.*?])\s+)([\s\S]*)$/) ?? [];
      if (description?.trim()) {
        return this.translateSentence(description).then(translation => {
          if (translation.trim() !== description.trim()) {
            tag.text = (name ?? '') + removeExtraBlankLines(translation);
          }
        });
      }
    } else if (isUnaryTag(tag)) {
      const [, prefix, description] = (text ?? '').match(/^({.*?}\s*)?([\s\S]*)$/);
      if (description?.trim()) {
        return this.translateSentence(description).then(translation => {
          if (translation.trim() !== description.trim()) {
            const leadingLines = ['publicApi', 'returns', 'codeGenApi', 'ngModule'].includes(tag.tagName) ? '\n\n' : '';
            const tailingLines = ['usageNotes', 'description', 'deprecated'].includes(tag.tagName) ? '\n\n' : '';
            tag.text = leadingLines + (prefix ?? '') + tailingLines + removeExtraBlankLines(translation);
          }
        });
      }
    }
  }
}

// 有两个参数且需要翻译的标记，如 @param a Some value
function isBinaryTag(tag: OptionalKind<JSDocTagStructure>): boolean {
  return ['param', 'arg', 'argument', 'property', 'prop', 'yields', 'yield', 'template', 'breaking-change'].includes(tag.tagName);
}

// 有一个参数且需要翻译的标记，如 @returns Some value
function isUnaryTag(tag: OptionalKind<JSDocTagStructure>): boolean {
  return ['returns', 'return', 'classdesc', 'description', 'desc', 'summary', 'throws',
    'deprecated', 'usageNotes', 'see'].includes(tag.tagName);
}

function removeExtraBlankLines(translation: string) {
  return translation.replace(/\n$/s, '') + '\n';
}
