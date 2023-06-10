import { TranslationEngine } from '../translation-engine/translation-engine';
import { readFileSync, writeFileSync } from 'fs';
import { SentenceFormat } from './sentence-format';
import { TranslationOptions } from './translation-options';
import { containsChinese } from '../dom/common';

export abstract class AbstractTranslator<T> {
  constructor(protected readonly engine: TranslationEngine) {
  }

  async setup(): Promise<void> {
  }

  async tearDown(): Promise<void> {
  }

  async translateFile(filename: string, options: TranslationOptions = {}): Promise<void> {
    const content = readFileSync(filename, 'utf8');
    this.engine.currentFile = filename;
    const result = await this.translateContent(content, { ...options, filename });
    console.log('Total bytes: ', this.engine.totalBytes);
    writeFileSync(filename, result.trim() + '\n', 'utf8');
  }

  async translateContent(content: string, options: TranslationOptions = {}): Promise<string> {
    const doc = this.parse(content, options);
    this.translateDoc(doc, options);
    await this.flush();
    return this.serialize(doc, options);
  }

  // 前面所有的工作都是在安排异步任务，调 flush 才真正开始执行
  async flush(): Promise<void> {
    return this.engine.flush();
  }

  abstract parse(text: string, options: TranslationOptions): T;

  protected async translateSentence(sentence: string, format: SentenceFormat): Promise<string> {
    return this.engine.translate(sentence, format)
      // 翻译结果不包含中文时，说明没有进行实质性翻译，返回原文，以便调用者忽略它
      .then((translation) => containsChinese(translation) ? translation : sentence);
  }

  protected abstract translateDoc(doc: T, options: TranslationOptions): T;

  abstract serialize(doc: T, options: TranslationOptions): string;
}
