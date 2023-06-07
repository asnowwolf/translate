import { AbstractTranslator } from './abstract-translator';
import { Dict } from '../dict/dict';
import { getDict } from '../dict/get-dict';

export class DbTranslator extends AbstractTranslator<any> {
  async translateFile(filename: string): Promise<void> {
    const dict = getDict();
    await dict.open(filename);
    try {
      await this.translateDict(dict);
    } finally {
      await dict.close();
    }
  }

  async translateDict(dict: Dict): Promise<void> {
    const allEntries = await dict.query();
    const newEntries = allEntries.filter(it => !it.isRegExp && !it.chinese);
    newEntries.map(entry => this.translateSentence(entry.english, entry.format)
      .then(translation => {
        entry.chinese = translation.trim();
        entry.confidence = 'Engine';
      })
      .then(() => dict.save(entry)));

    await this.flush();
    console.log('total bytes: ', this.engine.totalBytes);
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
