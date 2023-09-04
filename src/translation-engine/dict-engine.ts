import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { Dict } from '../dict/dict';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { getNewFilenameFor } from './get-new-filename-for';
import { TranslationPair } from '../translator/translation-pair';

export class DictTranslationEngine extends TranslationEngine {
  private dict: Dict;

  constructor(private readonly options: TranslationEngineOptions) {
    super();
    this.dict = new Dict();
  }

  async setup(currentFile: string): Promise<void> {
    await super.setup(currentFile);
    await this.dict.open(getNewFilenameFor(currentFile, this.options.cwd, this.options.dict, '.dict.md'));
  }

  async tearDown(): Promise<void> {
    await this.dict.close();
    await super.tearDown();
  }

  protected async batchTranslate(pairs: TranslationPair[], format: SentenceFormat): Promise<TranslationPair[]> {
    for (let pair of pairs) {
      const english = SentenceFormatter.toMarkdown(pair[0], format);
      const entry = await this.dict.get(english);
      if (!entry) {
        continue;
      }
      const chinese = entry.chinese;
      if (!chinese) {
        continue;
      }
      pair[1] = SentenceFormatter.fromMarkdown(chinese, format);
    }
    return pairs;
  }
}
