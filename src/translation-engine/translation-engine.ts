import { chunk, groupBy } from 'lodash';
import { PromiseMaker } from '../dom/promise-maker';
import { delay } from '../dom/delay';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';

function isPlainUrl(url: string): boolean {
  return /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(url);
}

function inBlackList(text: string): boolean {
  return ['angular', 'number', 'string', 'object'].includes(text.toLowerCase());
}

function isCode(html: string): boolean {
  return html.startsWith('<code') && html.endsWith('</code>');
}

function isCamelCaseName(text: string): boolean {
  return /^[_a-zA-Z]+([A-Z]\w+)+$/.test(text);
}

export abstract class TranslationEngine {
  batchSize = 50;
  private _totalBytes = 0;

  get totalBytes(): number {
    return this._totalBytes;
  }

  currentFile: string;

  async init(): Promise<void> {
    this._totalBytes = 0;
  }

  async dispose(): Promise<void> {
  }

  private tasks: { sentence: string, format: SentenceFormat, result$: PromiseMaker<string> }[] = [];

  translate(sentence: string, format: SentenceFormat): Promise<string> {
    const text = sentence.trim();
    if (!text || isPlainUrl(text) || inBlackList(text) || isCamelCaseName(text)) {
      return Promise.resolve(sentence);
    }
    const html = SentenceFormatter.toHtml(sentence, format).trim();
    if (isCode(html)) {
      return Promise.resolve(sentence);
    }

    const result$ = new PromiseMaker<string>();
    this.tasks.push({ sentence, format, result$ });
    return result$.promise;
  }

  protected abstract batchTranslate(sentences: string[], format: SentenceFormat): Promise<string[]>;

  flush(): Promise<void> {
    const groups = groupBy(this.tasks, 'format');
    Object.entries(groups).forEach(([format, tasks]) => {
      const chunks = chunk(tasks, this.batchSize);
      chunks.forEach(chunk => {
        const sentences = chunk.map(it => it.sentence);
        this._totalBytes += sentences.join('\n').length;
        this.batchTranslate(sentences, format as SentenceFormat).then(translations => {
          chunk.forEach(({ result$ }, index) => {
            result$.resolve(translations[index]);
          });
        });
      });
    });

    const tasks = this.tasks.map(({ result$ }) => result$.promise);
    return Promise.all(tasks)
      .then(() => this.tasks = [])
      // add a small delay to ensure that all derived promises(such as Promise.all) are resolved
      .then(() => delay(0));
  }
}
