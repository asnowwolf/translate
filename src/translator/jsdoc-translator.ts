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
    await this.translateNode(sourceFile, this.engine);
    return sourceFile.getFullText();
  }

  async translateNode(node: Node, engine: TranslationEngine): Promise<void> {
    if (Node.isJSDocableNode(node) && shouldTranslate(node, this.options)) {
      const docs = node.getJsDocs();
      for (const doc of docs) {
        const structure = doc.getStructure();
        for (const tag of structure.tags) {
          await this.translateTag(tag, engine);
        }
        const origin = (structure.description as string).trim();
        if (origin) {
          const translation = await this.markdownTranslator.translate(structure.description as string);
          if (translation.trim() !== origin.trim()) {
            structure.description = trimLastLf(translation);
          }
        }
        if (!isDeepStrictEqual(structure, doc.getStructure())) {
          doc.set(structure);
        }
      }
    }
    for (const subNode of node.getChildren()) {
      await this.translateNode(subNode, engine);
    }
  }

  async translateTag(tag: OptionalKind<JSDocTagStructure>, engine: TranslationEngine) {
    const text = tag.text as string;

    if (isBinaryTag(tag)) {
      const [, name, description] = (text ?? '').match(/^((?:{.*?}\s*)?[\w.]+\s+)([\s\S]*)$/) ?? [];
      if (description?.trim()) {
        const translation = await this.markdownTranslator.translate(description);
        if (translation.trim() !== description.trim()) {
          tag.text = (name ?? '') + trimLastLf(translation);
        }
      }
    } else if (isUnaryTag(tag)) {
      const [, prefix, description] = (text ?? '').match(/^({.*?}\s*)?([\s\S]*)$/);
      if (description?.trim()) {
        const translation = await this.markdownTranslator.translate(description);
        if (translation.trim() !== description.trim()) {
          tag.text = (prefix ?? '') + trimLastLf(translation);
        }
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
  return ['returns', 'return', 'classdesc', 'description', 'desc', 'summary', 'throws', 'deprecated', 'usageNotes', 'see'].includes(tag.tagName);
}

function trimLastLf(translation: string) {
  return translation.replace(/\n$/s, '');
}
