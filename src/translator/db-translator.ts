import { Translator } from './translator';
import { Dict } from '../dict/dict';

export class DbTranslator extends Translator {
  async translateFile(filename: string): Promise<void> {
    const dict = new Dict();
    await dict.open(filename);
    try {
      const allEntries = await dict.findAll();
      const newEntries = allEntries.filter(it => !it.isRegExp && !it.chinese);
      newEntries.map(entry => this.engine.translateHtml(entry.english)
        .then(translation => {
          entry.chinese = translation.trim();
          entry.confidence = 'Engine';
        })
        .then(() => dict.save(entry)));
      await this.engine.flush();
    } finally {
      await dict.close();
    }
  }

  async translate(text: string): Promise<string> {
    return Promise.resolve('');
  }
}
