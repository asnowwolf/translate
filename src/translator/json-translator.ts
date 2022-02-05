import { Translator } from './translator';
import { containsChinese } from '../utils/common';
import { isDeepStrictEqual } from 'util';

export class JsonTranslator extends Translator {
  async translate(text: string): Promise<string> {
    const obj = JSON.parse(text);
    this.translateObject(obj);
    await this.engine.flush();
    if (isDeepStrictEqual(obj, JSON.parse(text))) {
      return text;
    }
    return JSON.stringify(obj, null, 2);
  }

  translateObject(obj: Object): void {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (this.options.jsonProperties.includes(key) && typeof value === 'string' && !containsChinese(value)) {
          this.engine.translateHtml(value)
            .then((it) => it.trim())
            .then((translation) => {
              if (value !== translation) {
                obj[key] = `${value}\n\n${translation}`;
              }
            });
        }
        if (value instanceof Object) {
          this.translateObject(value);
        }
      }
    }
  }
}

