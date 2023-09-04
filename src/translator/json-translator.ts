import { AbstractTranslator } from './abstract-translator';
import { containsChinese } from '../dom/common';
import { TranslationOptions } from './translation-options';

export class JsonTranslator extends AbstractTranslator<object> {
  parse(text: string): object {
    return JSON.parse(text);
  }

  serialize(doc: object): string {
    return JSON.stringify(doc, null, 2);
  }

  translateDoc(doc: Readonly<Object>, options: TranslationOptions): Object {
    const result = createTranslationWithOrderedProperties(doc);
    for (let key in doc) {
      if (doc.hasOwnProperty(key)) {
        const original = doc[key];
        const translation = doc[`${key}Cn`];
        if (original instanceof Object) {
          result[key] = this.translateDoc(original, options);
        } else {
          result[key] = original;
          if (options.jsonProperties?.includes(key) && typeof original === 'string' && !containsChinese(original)) {
            this.translateSentence(original, translation, 'markdown')
              .then((it) => it.trim())
              .then((translation) => {
                if (translation && original !== translation && !key.endsWith('Cn') && containsChinese(translation)) {
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
    if (typeof original[key] === 'string') {
      resultDescriptors[`${key}Cn`] = descriptor;
    }
    resultDescriptors[key] = descriptor;
  });
  Object.defineProperties(translation, resultDescriptors);
  return translation;
}
