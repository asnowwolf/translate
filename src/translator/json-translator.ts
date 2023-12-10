import { AbstractTranslator } from './abstract-translator';
import { containsChinese } from '../dom/common';
import { TranslationOptions } from './translation-options';
import { MarkdownTranslator } from './markdown-translator';

export class JsonTranslator extends AbstractTranslator<object> {
  private markdownTranslator = new MarkdownTranslator(this.engine);

  parse(text: string): object {
    return JSON.parse(text);
  }

  serialize(doc: object): string {
    removeUntranslatedCnProperties(doc);
    return JSON.stringify(doc, null, 2);
  }

  translateDoc(doc: Readonly<Object>, options: TranslationOptions): Object {
    const result = createTranslationWithOrderedProperties(doc);
    for (let key in doc) {
      if (!key.endsWith('Cn') && doc.hasOwnProperty(key)) {
        const original = doc[key];
        const currentTranslation = doc[`${key}Cn`];
        if (currentTranslation) {
          // 以前版本的翻译中只有单行的才是对照格式，多行的无法复用，需要重新翻译
          if (!currentTranslation.includes('\n\n')) {
            this.engine.translate(original, currentTranslation, 'plain').then();
          } else {
            this.markdownTranslator.translateContentAndFlush(currentTranslation, options).then();
          }
          continue;
        }
        if (Array.isArray(original)) {
          result[key] = original.map(it => {
            if (Array.isArray(it) || it instanceof Object) {
              return this.translateDoc(it, options);
            } else {
              return it;
            }
          });
        } else if (original instanceof Object) {
          result[key] = this.translateDoc(original, options);
        } else {
          result[key] = original;
          if (options.jsonProperties?.includes(key) && typeof original === 'string' && !containsChinese(original)) {
            this.markdownTranslator.translateContentAndFlush(original, options)
              .then((it) => it.trim())
              .then((translation) => {
                if (translation && original !== translation && containsChinese(translation)) {
                  result[`${key}Cn`] = translation;
                }
              });
          }
        }
      }
    }
    return result;
  }
}

function createTranslationWithOrderedProperties(original: Readonly<Object>): Object {
  const translation = {};
  const descriptors = Object.getOwnPropertyDescriptors(original);
  const resultDescriptors = {};
  Object.entries(descriptors).forEach(([key, descriptor]) => {
    if (typeof original[key] === 'string' && !key.endsWith('Cn') && !descriptors[`${key}Cn`]) {
      resultDescriptors[`${key}Cn`] = descriptor;
    }
    resultDescriptors[key] = descriptor;
  });
  Object.defineProperties(translation, resultDescriptors);
  return translation;
}

function removeUntranslatedCnProperties(doc: Object) {
  if (Array.isArray(doc)) {
    doc.forEach((it) => removeUntranslatedCnProperties(it));
  } else if (doc instanceof Object) {
    Object.keys(doc).forEach((key) => {
      if (!key.endsWith('Cn') && doc[key] === doc[`${key}Cn`]) {
        delete doc[`${key}Cn`];
      }
      if (doc[key] instanceof Object) {
        removeUntranslatedCnProperties(doc[key]);
      }
    });
  }
}
