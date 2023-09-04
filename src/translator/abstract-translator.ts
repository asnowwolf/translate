import { TranslationEngine } from '../translation-engine/translation-engine';
import { readFileSync, writeFileSync } from 'fs';
import { SentenceFormat } from './sentence-format';
import { TranslationOptions } from './translation-options';
import { containsChinese } from '../dom/common';
import { TranslationEngineType } from '../translation-engine/translation-engine-type';

export abstract class AbstractTranslator<T> {
  constructor(protected readonly engine: TranslationEngine) {
  }

  async setup(): Promise<void> {
  }

  async tearDown(): Promise<void> {
  }

  async translateFile(filename: string, options: TranslationOptions = {}): Promise<void> {
    const content = readFileSync(filename, 'utf8');
    const result = await this.translateContentAndFlush(content, { ...options, filename });
    // 提取时不应该更新原始文件
    if (![TranslationEngineType.extractor, TranslationEngineType.vectorizer].includes(options.engine)) {
      writeFileSync(filename, result.trim() + '\n', 'utf8');
    }
  }

  async translateContentAndFlush(content: string, options: TranslationOptions): Promise<string> {
    await this.engine.setup(options.filename);
    try {
      const result = this.translateContent(content, options);
      await this.flush();
      return this.serialize(result, options);
    } finally {
      await this.engine.tearDown();
    }
  }

  translateContent(content: string, options: TranslationOptions) {
    const doc = this.parse(content, options);
    return this.translateDoc(doc, options);
  }

// 前面所有的工作都是在安排异步任务，调 flush 才真正开始执行
  async flush(): Promise<void> {
    return this.engine.flush();
  }

  abstract parse(text: string, options: TranslationOptions): T;

  protected async translateSentence(sentence: string, translation: string, format: SentenceFormat): Promise<string> {
    return this.engine.translate(sentence, translation, format)
      // 翻译结果不包含中文时，说明没有进行实质性翻译，返回原文，以便调用者忽略它
      .then((translation) => containsChinese(translation) ? translation : sentence);
  }

  protected abstract translateDoc(doc: T, options: TranslationOptions): T;

  abstract serialize(doc: T, options: TranslationOptions): string;
}
