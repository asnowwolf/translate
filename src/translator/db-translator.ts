import { Translator } from './translator';
import { Dict } from '../dict/dict';

export class DbTranslator extends Translator {
  async translateFile(filename: string): Promise<void> {
    const dict = new Dict();
    await dict.open(filename);
    try {
      const allEntries = await dict.findAll();
      const newEntries = allEntries.filter(it => !it.isRegExp && !it.chinese);
      const translations = await this.engine.translate(newEntries.map(it => it.english));
      for (let i = 0; i < translations.length; ++i) {
        const entry = newEntries[i];
        entry.chinese = translations[i].trim();
        await dict.save(entry);
      }
    } finally {
      await dict.close();
    }
  }

  async translate(text: string): Promise<string> {
    return Promise.resolve('');
  }
}
