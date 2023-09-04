import { chunk, cloneDeep, groupBy } from 'lodash';
import { PromiseMaker } from '../dom/promise-maker';
import { SentenceFormat } from '../translator/sentence-format';
import { SentenceFormatter } from './sentence-formatter';
import { TranslationPair } from '../translator/translation-pair';
import { delay } from '../dom/delay';

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

  private tasks: { pair: TranslationPair, format: SentenceFormat, result$: PromiseMaker<string> }[] = [];

  // 不要 override 这个方法，只能 override batchTranslate
  public async translate(original: string, translation: string, format: SentenceFormat): Promise<string> {
    if (this.shouldIgnore(original, format)) {
      return original;
    }

    const result$ = new PromiseMaker<string>();
    const pair: TranslationPair = [original, translation];
    this.tasks.push({ pair, format, result$ });
    return result$.promise;
  }

  protected abstract batchTranslate(pairs: TranslationPair[], format: SentenceFormat): Promise<TranslationPair[]>;

  async flush(): Promise<void> {
    const groups = groupBy(this.tasks, 'format');
    for (let [format, tasks] of Object.entries(groups)) {
      const chunks = chunk(tasks, this.batchSize);
      for (let chunk of chunks) {
        const pairs = chunk.map(it => it.pair);
        this._totalBytes += pairs.map(it => it[0]).join('\n').length;
        const translations = await this.batchTranslate(cloneDeep(pairs), format as SentenceFormat);
        chunk.forEach(({ result$ }, index) => {
          if (pairs[index][1]) {
            result$.resolve(undefined);
          } else {
            result$.resolve(translations[index][1]);
          }
        });
      }
    }

    const tasks = this.tasks.map(({ result$ }) => result$.promise);
    return Promise.all(tasks)
      .then(() => this.tasks = [])
      // add a small delay to ensure that all derived promises(such as Promise.all) are resolved
      .then(() => delay(0));
  }

  protected shouldIgnore(original: string, format: SentenceFormat) {
    const text = original?.trim();
    if (!text || isPlainUrl(text) || inBlackList(text) || isCamelCaseName(text) || isAnchor(text)) {
      return true;
    }
    const html = SentenceFormatter.toHtml(original, format).trim().replace(/^<p>(.*)<\/p>$/gs, '$1');
    return isCode(html);
  }
}
