import { IndentationText, JSDocTagStructure, Node, OptionalKind, Project } from 'ts-morph';
import { TranslationEngine } from './engine';
import { markdown } from './markdown';
import { isDeepStrictEqual } from 'util';

export namespace jsdoc {
  export async function translate(content: string, engine: TranslationEngine): Promise<string> {
    const project = new Project({ manipulationSettings: { indentationText: IndentationText.TwoSpaces } });
    const sourceFile = project.createSourceFile('placeholder.ts', content);
    await translateNode(sourceFile, engine);
    return sourceFile.getFullText();
  }

  async function translateNode(node: Node, engine: TranslationEngine): Promise<void> {
    if (Node.isJSDocableNode(node)) {
      const docs = node.getJsDocs();
      for (const doc of docs) {
        const structure = doc.getStructure();
        for (const tag of structure.tags) {
          await translateTag(tag, engine);
        }
        const origin = (structure.description as string).trim();
        if (origin) {
          const translation = await markdown.translate(structure.description as string, engine);
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
      await translateNode(subNode, engine);
    }
  }

  async function translateTag(tag: OptionalKind<JSDocTagStructure>, engine: TranslationEngine) {
    const text = tag.text as string;

    if (isBinaryTag(tag)) {
      const [, name, description] = text.match(/^((?:{.*?}\s*)?[\w.]+\s+)([\s\S]*)$/) ?? [];
      if (description?.trim()) {
        const translation = await markdown.translate(description, engine);
        if (translation.trim() !== description.trim()) {
          tag.text = (name ?? '') + trimLastLf(translation);
        }
      }
    } else if (isUnaryTag(tag)) {
      const [, prefix, description] = text.match(/^({.*?}\s*)?([\s\S]*)$/);
      if (description?.trim()) {
        const translation = await markdown.translate(description, engine);
        if (translation.trim() !== description.trim()) {
          tag.text = (prefix ?? '') + trimLastLf(translation);
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
    return ['returns', 'return', 'classdesc', 'description', 'desc', 'summary', 'throws'].includes(tag.tagName);
  }
}

function trimLastLf(translation: string) {
  return translation.replace(/\n$/s, '');
}
