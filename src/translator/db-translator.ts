import { AbstractTranslator } from './abstract-translator';
import { SqliteDict } from '../dict/sqlite-dict';

export class DbTranslator extends AbstractTranslator<any> {
  async translateFile(filename: string): Promise<void> {
    const dict = new SqliteDict();
    await dict.open(filename);
    try {
      await this.translateDict(dict);
    } finally {
      await dict.close();
    }
  }

  async translateDict(dict: SqliteDict): Promise<void> {
    const allEntries = await dict.query();
    const newEntries = allEntries.filter(it => !it.isRegExp && !it.chinese);
    newEntries.map(entry => this.translateSentence(entry.english, entry.format)
      .then(translation => {
        entry.chinese = translation.trim();
        entry.confidence = 'Engine';
      })
      .then(() => dict.save(entry)));
    await this.flush();
  }

  parse(text: string): any {
    throw new Error('Method not implemented.');
  }

  serialize(doc: any): string {
    throw new Error('Method not implemented.');
  }

  translateDoc(doc: any): any {
    throw new Error('Method not implemented.');
  }
}
