import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { Dict } from '../dict/dict';
import { SentenceFormat } from '../translator/sentence-format';
import { getDict } from '../dict/get-dict';
import { SentenceFormatter } from './sentence-formatter';

export class DictTranslationEngine extends TranslationEngine {
  private dict: Dict;

  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  async init(): Promise<void> {
    this.dict = getDict();
    this.dict.open(this.options.dict);
  }

  async dispose(): Promise<void> {
    this.dict.close();
  }

  protected async batchTranslate(texts: string[], format: SentenceFormat): Promise<string[]> {
    return Promise.all(texts.map(async (text) => {
      const english = SentenceFormatter.toMarkdown(text, format);
      const entry = this.dict.get(english);
      if (!entry) {
        return text;
      }
      const chinese = entry.chinese;
      if (!chinese) {
        return text;
      }
      switch (entry.confidence) {
        case 'Engine':
          return `${SentenceFormatter.fromMarkdown(chinese, format)}【引擎翻译】`;
        case 'Manual':
          return SentenceFormatter.fromMarkdown(chinese, format);
      }
    }));
  }
}
