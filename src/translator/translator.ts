import { TranslationEngine } from '../translation-engine/translation-engine';
import { readFileSync, writeFileSync } from 'fs';

export abstract class Translator {
  private _filename: string;
  protected get filename(): string {
    return this._filename;
  }

  constructor(protected readonly engine: TranslationEngine) {
  }

  async translateFile(filename: string): Promise<void> {
    this._filename = filename;
    const content = readFileSync(this.filename, 'utf8');
    const result = await this.translate(content);
    writeFileSync(this.filename, result, 'utf8');
  }

  abstract async translate(text: string): Promise<string>;
}
