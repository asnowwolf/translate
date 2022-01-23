import { chunk, uniq } from 'lodash';

export abstract class TranslationEngine {
  batchSize = 100;
  context: { filename?: string } = {};
  translated = 0;

  async init(): Promise<void> {
  }

  async dispose(): Promise<void> {
  }

  async translate(texts: string[]): Promise<string[]> {
    if (!texts.filter(it => it?.trim().length).length) {
      return texts;
    }
    const originals = uniq(texts.filter(it => it.length > 2));
    const batches = chunk(originals, this.batchSize);
    const chunks = await Promise.all(batches.map(async (it) => this.doTranslate(it)));
    const translations = chunks.flat();
    return texts.map(it => {
      const index = originals.indexOf(it);
      return translations[index];
    });
  }

  protected abstract async doTranslate(texts: string[]): Promise<string[]>;
}
