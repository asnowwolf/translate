import { chunk, groupBy } from 'lodash';
import { PromiseMaker } from '../dom/promise-maker';
import { delay } from '../dom/delay';
import { SentenceFormat } from '../translator/sentence-format';

function isPlainUrl(url: string): boolean {
  return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(url);
}

export abstract class TranslationEngine {
  batchSize = 50;
  private _totalBytes = 0;
  get totalBytes(): number {
    return this._totalBytes;
  }

  async init(): Promise<void> {
    this._totalBytes = 0;
  }

  async dispose(): Promise<void> {
  }

  private tasks: { sentence: string, format: SentenceFormat, result$: PromiseMaker<string> }[] = [];

  translate(sentence: string, format: SentenceFormat): Promise<string> {
    if (!sentence?.trim() || isPlainUrl(sentence.trim())) {
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
