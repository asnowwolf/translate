import { chunk, uniq } from 'lodash';
import { htmlToMd, mdToHtml } from '../unified/markdown';

export abstract class TranslationEngine {
  batchSize = 100;
  context: { filename?: string } = {};
  translated = 0;

  async init(): Promise<void> {
  }

  async dispose(): Promise<void> {
  }

  async translateMd(texts: string[]): Promise<string[]> {
    const result = await this.translateHtml(texts.map(text => mdToHtml(text.trim())));
    return result.map(html => htmlToMd(html).trim());
  }

  async translateHtml(texts: string[]): Promise<string[]> {
    if (!texts.filter(it => it?.trim().length).length) {
      return texts;
    }
    const originals = uniq(texts.filter(it => it?.trim()));
    const batches = chunk(originals, this.batchSize);
    const chunks = await Promise.all(batches.map(async (it) => this.doTranslateHtml(it)));
    const translations = chunks.flat();
    return texts.map(it => {
      const index = originals.indexOf(it);
      return translations[index] ?? it;
    });
  }

  protected abstract async doTranslateHtml(texts: string[]): Promise<string[]>;
}
