import { Translator } from './translator';
import { TranslationEngine } from '../translation-engine/translation-engine';
import { IndentationText, JSDocTag, JSDocTagStructure, Node, OptionalKind, Project } from 'ts-morph';
import { isDeepStrictEqual } from 'util';
import { MarkdownTranslator } from './markdown-translator';

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

function shouldTranslate(node: Node, options: { mustIncludesTag?: string, mustExcludesTag?: string }): boolean {
  if (!Node.isJSDocableNode(node)) {
    return false;
  }
  const tags = getTagsWithAncestors(node).map(it => it.getTagName());
  return (!options.mustIncludesTag || tags.includes(options.mustIncludesTag)) &&
    (!options.mustExcludesTag || !tags.includes(options.mustExcludesTag));
}

export class JsdocTranslator extends Translator {
  private readonly markdownTranslator = new MarkdownTranslator(this.engine);

  async translate(text: string): Promise<string> {
    const project = new Project({ manipulationSettings: { indentationText: IndentationText.TwoSpaces } });
    const sourceFile = project.createSourceFile('placeholder.ts', text);
    this.translateNode(sourceFile, this.engine);
    await this.engine.flush();
    return sourceFile.getFullText();
  }

  translateNode(node: Node, engine: TranslationEngine): void {
    if (Node.isJSDocableNode(node) && shouldTranslate(node, this.options)) {
      const docs = node.getJsDocs();
      for (const doc of docs) {
        const structure = doc.getStructure();
        const tagTasks = structure.tags.map(tag => this.translateTag(tag));
        const origin = (structure.description as string).trim();
        const descriptionTask = this.markdownTranslator.translate(origin).then(translation => {
          if (translation.trim() !== origin.trim()) {
            structure.description = trimLastLf(translation);
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
      this.translateNode(subNode, engine);
    });
  }

  translateTag(tag: OptionalKind<JSDocTagStructure>): Promise<void> | undefined {
    const text = tag.text as string;

    if (isBinaryTag(tag)) {
      const [, name, description] = (text ?? '').match(/^((?:{.*?}\s*)?(?:[\w.\[\]]+|\[.*?])\s+)([\s\S]*)$/) ?? [];
      if (description?.trim()) {
        return this.markdownTranslator.translate(description).then(translation => {
          if (translation.trim() !== description.trim()) {
            tag.text = (name ?? '') + trimLastLf(translation);
          }
        });
      }
    } else if (isUnaryTag(tag)) {
      const [, prefix, description] = (text ?? '').match(/^({.*?}\s*)?([\s\S]*)$/);
      if (description?.trim()) {
        return this.markdownTranslator.translate(description).then(translation => {
          if (translation.trim() !== description.trim()) {
            tag.text = (prefix ?? '') + trimLastLf(translation);
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

function trimLastLf(translation: string) {
  return translation.replace(/\n$/s, '');
}
