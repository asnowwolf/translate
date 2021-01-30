import { TranslationEngine } from './translation-engine';
import { Dict } from '../dict/dict';

export class DictTranslationEngine extends TranslationEngine {
  constructor(private readonly dict: Dict) {
    super();
  }

  protected async doTranslate(texts: string[]): Promise<string[]> {
    return Promise.all(texts.map(async (text) => {
      const english = text.trim();
      const entry = await this.dict.find(this.context.filename, english);
      return entry?.chinese || text;
    }));
  }
}
