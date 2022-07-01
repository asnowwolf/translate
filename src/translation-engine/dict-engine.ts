import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { Dict } from '../dict/dict';
import { SqliteDict } from '../dict/sqlite-dict';
import { SentenceFormat } from '../translator/sentence-format';

export class DictTranslationEngine extends TranslationEngine {
  private dict: Dict;
  private isInternalDict = false;

  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  async init(): Promise<void> {
    if (typeof this.options.dict === 'string') {
      this.isInternalDict = true;
      this.dict = new SqliteDict();
      await this.dict.open(this.options.dict);
    } else {
      this.isInternalDict = false;
      this.dict = this.options.dict;
    }
  }

  async dispose(): Promise<void> {
    if (this.isInternalDict) {
      await this.dict.close();
    }
  }

  protected async batchTranslate(texts: string[], format: SentenceFormat): Promise<string[]> {
    return Promise.all(texts.map(async (text) => {
      const english = text.trim();
      const entry = await this.dict.get(english, format);
      if (!entry) {
        return text;
      }
      const chinese = entry.chinese;
      if (!chinese) {
        return text;
      }
      switch (entry.confidence) {
        case 'DictFuzzy':
          return `${chinese}【模糊翻译】`;
        case 'Engine':
          return `${chinese}【引擎翻译】`;
        case 'DictAccurate':
        case 'Manual':
          return chinese;
      }
    }));
  }
}
