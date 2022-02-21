import { TranslationEngine } from './translation-engine';
import { htmlToMd, mdToHtml } from '../dom/unified/markdown';

export class NoopTranslationEngine extends TranslationEngine {
  protected async doTranslateHtml(texts: string[]): Promise<string[]> {
    return texts.map(text => htmlToMd(mdToHtml(text)).trim());
  }
}
