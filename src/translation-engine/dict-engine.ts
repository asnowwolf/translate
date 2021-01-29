import { TranslationEngine } from './translation-engine';
import { Dict } from '../dict/dict';
import { htmlToMd, mdToHtml } from '../markdown';

export class DictTranslationEngine extends TranslationEngine {
  constructor(private readonly dict: Dict) {
    super();
  }

  protected async doTranslate(texts: string[]): Promise<string[]> {
    return Promise.all(texts.map(async (text) => {
      const english = htmlToMd(text).trim();
      const entry = await this.dict.find(this.context.filename, english);
      return mdToHtml(entry?.chinese)?.trim() || text;
    }));
  }
}
