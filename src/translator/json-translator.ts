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

  translateDoc(doc: Object, options: TranslationOptions): Object {
    for (let key in doc) {
      if (doc.hasOwnProperty(key)) {
        const value = doc[key];
        if (options.jsonProperties?.includes(key) && typeof value === 'string' &&
          !containsChinese(value) && !containsChinese(doc[`${key}Cn`])) {
          this.translateSentence(value, 'markdown')
            .then((it) => it.trim())
            .then((translation) => {
              if (value !== translation && containsChinese(translation)) {
                doc[`${key}Cn`] = translation;
              }
            });
        }
        if (value instanceof Object) {
          this.translateDoc(value, options);
        }
      }
    }
    return doc;
  }
}

