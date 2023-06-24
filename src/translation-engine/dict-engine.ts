import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { Dict } from '../dict/dict';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { getDictFilenameFor } from './get-dict-filename-for';

export class DictTranslationEngine extends TranslationEngine {
  private dict: Dict;

  constructor(private readonly options: TranslationEngineOptions) {
    super();
    this.dict = new Dict();
  }

  async setup(currentFile: string): Promise<void> {
    await super.setup(currentFile);
    await this.dict.open(getDictFilenameFor(currentFile, this.options.cwd, this.options.dict));
  }

  async tearDown(): Promise<void> {
    await this.dict.close();
    await super.tearDown();
  }

  protected async batchTranslate(texts: string[], format: SentenceFormat): Promise<string[]> {
    return Promise.all(texts.map(async (text) => {
      const english = SentenceFormatter.toMarkdown(text, format);
      const entry = await this.dict.get(english);
      if (!entry) {
        return text;
      }
      const chinese = entry.chinese;
      if (!chinese) {
        return text;
      }
      return SentenceFormatter.fromMarkdown(chinese, format);
    }));
  }
}
