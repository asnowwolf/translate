import { IndentationText, JSDocTagStructure, Node, OptionalKind, Project } from 'ts-morph';
import { TranslationEngine } from './engine';
import { markdown } from './markdown';

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
        structure.description = await markdown.translate(structure.description as string, engine);
        doc.set(structure);
      }
    }
    for (const subNode of node.getChildren()) {
      await translateNode(subNode, engine);
    }
  }

  async function translateTag(tag: OptionalKind<JSDocTagStructure>, engine: TranslationEngine) {
    const matches = splitTagText(tag);
    if (matches) {
      const [, prefix, text] = matches;
      if (prefix) {
        tag.text = (prefix ?? '') + await markdown.translate((text ?? ''), engine);
      }
    }
  }

  export function splitTagText(tag: OptionalKind<JSDocTagStructure>): RegExpMatchArray {
    const text = (tag.text as string);
    switch (tag.tagName) {
      case 'param':
      case 'arg':
      case 'argument':
      case 'property':
      case 'prop':
      case 'yields':
      case 'yield':
        return text.match(/^((?:{.*?}\s*)?[\w.]+\s+)([\s\S]*)$/);
      case 'returns':
      case 'return':
      case 'classdesc':
      case 'description':
      case 'desc':
      case 'summary':
      case 'throws':
        return text.match(/^({.*?}\s*)?([\s\S]*)$/);
      default:
        return [text, '', text];
    }
  }
}
