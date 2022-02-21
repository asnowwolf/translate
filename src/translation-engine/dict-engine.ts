import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { Dict } from '../dict/dict';
import { htmlToMd, mdToHtml } from '../dom/unified/markdown';
import { SqliteDict } from '../dict/sqlite-dict';

export class DictTranslationEngine extends TranslationEngine {
  private dict: Dict;

  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  async init(): Promise<void> {
    this.dict = new SqliteDict();
    await this.dict.open(this.options.dict);
  }

  async dispose(): Promise<void> {
    await this.dict.close();
  }

  protected async doTranslateHtml(texts: string[]): Promise<string[]> {
    return Promise.all(texts.map(async (text) => {
      const english = htmlToMd(text).trim().replace(/\n */g, ' ');
      const entry = await this.dict.get(this.context.filename, english);
      const chinese = mdToHtml(entry.chinese);
      if (!entry || !chinese) {
        return text;
      }
      switch (entry.confidence) {
        case 'DictFuzzy':
          return `${chinese}【词典模糊翻译】`;
        case 'Engine':
          return `${chinese}【引擎模糊翻译】`;
        case 'DictAccurate':
        case 'Manual':
          return chinese;
      }
    }));
  }
}
