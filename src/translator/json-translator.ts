import { Translator } from './translator';
import { containsChinese } from '../utils/common';

function isEqualObject(obj1: object, obj2: object): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export class JsonTranslator extends Translator {
  async translate(text: string): Promise<string> {
    const obj = JSON.parse(text);
    await this.translateObject(obj);
    if (isEqualObject(obj, JSON.parse(text))) {
      return text;
    }
    return JSON.stringify(obj, null, 2);
  }

  async translateObject(obj: Object): Promise<void> {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (this.options.jsonProperties.includes(key) && typeof value === 'string' && !containsChinese(value)) {
          const translations = await this.engine.translate([value]);
          const translation = translations[0]?.trim();
          if (value !== translation) {
            obj[key] = `${value}\n\n${translation}`;
          }
        }
        if (value instanceof Object) {
          await this.translateObject(value);
        }
      }
    }
  }
}

