import { htmlToMd, mdToHtml } from '../dom/unified/markdown';
import { chunk } from 'lodash';
import { PromiseMaker } from '../dom/promise-maker';
import { delay } from '../dom/delay';

export abstract class TranslationEngine {
  batchSize = 100;
  context: { filename?: string } = {};

  async init(): Promise<void> {
  }

  async dispose(): Promise<void> {
  }

  translateMd(text: string): Promise<string> {
    return this.translateHtml(mdToHtml(text.trim())).then(html => htmlToMd(html));
  }

  private buffer: { html: string, result$: PromiseMaker<string> }[] = [];

  translateHtml(html: string): Promise<string> {
    if (!html?.trim()) {
      return Promise.resolve(html);
    }

    const result$ = new PromiseMaker<string>();
    this.buffer.push({ html, result$ });
    return result$.promise;
  }

  flush(): Promise<void> {
    const chunks = chunk(this.buffer, this.batchSize);
    chunks.forEach(chunk => {
      this.doTranslateHtml(chunk.map(it => it.html)).then(translations => {
        chunk.forEach(({ result$ }, index) => {
          result$.resolve(translations[index]);
        });
      });
    });

    const tasks = this.buffer.map(({ result$ }) => result$.promise);
    return Promise.all(tasks)
      .then(() => this.buffer = [])
      // add a small delay to ensure that all derived promises(such as Promise.all) are resolved
      .then(() => delay(100));
  }

  protected abstract async doTranslateHtml(texts: string[]): Promise<string[]>;
}
