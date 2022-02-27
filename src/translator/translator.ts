import { TranslationEngine } from '../translation-engine/translation-engine';
import { readFileSync, writeFileSync } from 'fs';

export abstract class Translator {
  constructor(protected readonly engine: TranslationEngine, protected readonly options: Record<string, any> = {}) {
  }

  async translateFile(filename: string): Promise<void> {
    this.engine.context.filename = filename;
    const content = readFileSync(filename, 'utf8');
    const result = await this.translate(content);
    writeFileSync(filename, result, 'utf8');
  }

  abstract translate(text: string): Promise<string>;
}
