import { uniq } from 'lodash';

export abstract class TranslationEngine {
  batchSize = 100;
  context: { filename?: string } = {};
  translated = 0;

  async translate(texts: string[]): Promise<string[]> {
    if (!texts.filter(it => it?.trim().length).length) {
      return texts;
    }
    const originals = uniq(texts.filter(it => it.length > 2));
    this.translated += originals.join().length;
    const translations = await this.doTranslate(originals);
    return texts.map(it => {
      const index = originals.indexOf(it);
      return translations[index];
    });
  }

  protected abstract async doTranslate(texts: string[]): Promise<string[]>;
}
