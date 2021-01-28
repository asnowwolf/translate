import { readFileSync } from 'fs';
import { TranslationEngine } from './translation-engine';

export class DictTranslationEngine extends TranslationEngine {
  private dict: Map<string, string>;
  private params: Record<string, any>;

  init(params: Record<string, any>): void {
    this.params = params;
  }

  protected async doTranslate(texts: string[]): Promise<string[]> {
    this.load();
    return texts.map(text => this.dict[text] || text);
  }

  private load(): void {
    if (this.dict) {
      return;
    }
    this.dict = new Map<string, string>();
    const pairs = readFileSync(this.params['dict'], 'utf-8').split('\n');
    pairs.map(pair => pair.split('\t')).forEach(([en, cn]) => this.dict.set(en, cn));
  }
}
