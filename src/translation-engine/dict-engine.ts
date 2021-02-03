import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';

export class DictTranslationEngine extends TranslationEngine {
  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  protected async doTranslate(texts: string[]): Promise<string[]> {
    return Promise.all(texts.map(async (text) => {
      const english = text.trim().replace(/\n */g, ' ');
      const entry = await this.options.dict.find(this.context.filename, english);
      if (!entry || !entry.chinese) {
        return text;
      }
      switch (entry.confidence) {
        case 'DictFuzzy':
          return `${entry.chinese}【词典模糊翻译】`;
        case 'Engine':
          return `${entry.chinese}【引擎模糊翻译】`;
        case 'DictAccurate':
        case 'Manual':
          return entry.chinese;
      }
    }));
  }
}
