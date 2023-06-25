import { chunk, groupBy } from 'lodash';
import { PromiseMaker } from '../dom/promise-maker';
import { delay } from '../dom/delay';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { containsChinese } from '../dom/common';

function isPlainUrl(url: string): boolean {
  return /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(url);
}

function inBlackList(text: string): boolean {
  return ['angular', 'number', 'string', 'object'].includes(text.toLowerCase());
}

function isCode(html: string): boolean {
  return html.startsWith('<code') && html.endsWith('</code>') && html.indexOf('</code>') === html.lastIndexOf('</code>');
}

function isCamelCaseName(text: string): boolean {
  return /^[_a-zA-Z]+([A-Z]\w+)+$/.test(text);
}

function isAnchor(html: string): boolean {
  return /^<a id="[^"]*">\s*<\/a>$/.test(html);
}

export abstract class TranslationEngine {
  batchSize = 50;
  private _totalBytes = 0;

  get totalBytes(): number {
    return this._totalBytes;
  }

  currentFile: string;

  async setup(currentFile: string): Promise<void> {
    this.currentFile = currentFile;
    this._totalBytes = 0;
  }

  async tearDown(): Promise<void> {
    console.log('Total bytes: ', this.totalBytes);
  }

  private tasks: { original: string, format: SentenceFormat, result$: PromiseMaker<string> }[] = [];

  async translate(original: string, translation: string, format: SentenceFormat): Promise<string> {
    if (this.shouldIgnore(original, format)) {
      return original;
    }
    if (containsChinese(translation)) {
      return translation;
    }

    const result$ = new PromiseMaker<string>();
    this.tasks.push({ original, format, result$ });
    return result$.promise;
  }

  protected abstract batchTranslate(sentences: string[], format: SentenceFormat): Promise<string[]>;

  flush(): Promise<void> {
    const groups = groupBy(this.tasks, 'format');
    Object.entries(groups).forEach(([format, tasks]) => {
      const chunks = chunk(tasks, this.batchSize);
      chunks.forEach(chunk => {
        const sentences = chunk.map(it => it.original);
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

  protected shouldIgnore(original: string, format: SentenceFormat) {
    const text = original.trim();
    if (!text || isPlainUrl(text) || inBlackList(text) || isCamelCaseName(text) || isAnchor(text)) {
      return true;
    }
    const html = SentenceFormatter.toHtml(original, format).trim().replace(/^<p>(.*)<\/p>$/gs, '$1');
    return isCode(html);
  }
}
