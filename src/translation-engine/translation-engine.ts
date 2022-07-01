import { chunk, groupBy } from 'lodash';
import { PromiseMaker } from '../dom/promise-maker';
import { delay } from '../dom/delay';
import { SentenceFormat } from '../translator/sentence-format';

export abstract class TranslationEngine {
  batchSize = 50;

  async init(): Promise<void> {
  }

  async dispose(): Promise<void> {
  }

  private tasks: { sentence: string, format: SentenceFormat, result$: PromiseMaker<string> }[] = [];

  translate(sentence: string, format: SentenceFormat): Promise<string> {
    if (!sentence?.trim()) {
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
        this.batchTranslate(chunk.map(it => it.sentence), format as SentenceFormat).then(translations => {
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
