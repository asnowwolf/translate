import { TranslationEngine } from '../engines/translation-engine';
import { readFileSync, writeFileSync } from 'fs';

export abstract class FileTranslator {
  constructor(protected readonly filename: string, protected readonly engine: TranslationEngine) {
  }

  async translateFile(): Promise<void> {
    const content = readFileSync(this.filename, 'utf8');
    const result = await this.translate(content);
    writeFileSync(this.filename, result, 'utf8');
  }

  abstract async translate(text: string): Promise<string>;
}
