import { TranslationEngine } from './translation-engine';
import { htmlToMd, mdToHtml } from '../utils/markdown';

export class NoopTranslationEngine extends TranslationEngine {
  protected async doTranslate(texts: string[]): Promise<string[]> {
    return texts.map(text => htmlToMd(mdToHtml(text)).trim());
  }
}
