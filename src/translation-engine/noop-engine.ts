import { TranslationEngine } from './translation-engine';
import { TranslationEngineOptions } from './translation-engine-options';
import { htmlToMd, mdToHtml } from '../markdown';

export class NoopTranslationEngine extends TranslationEngine {
  constructor(private readonly options: TranslationEngineOptions) {
    super();
  }

  protected async doTranslate(texts: string[]): Promise<string[]> {
    const dict = this.options.dict;
    texts.forEach(text => {
      const english = htmlToMd(mdToHtml(text)).trim();
      if (!dict.findByRegExp(english)) {
        dict.createOrUpdate(this.context.filename, english, '', '');
      }
    });
    return texts;
  }
}
