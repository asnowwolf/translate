import { CommandBuilder } from 'yargs';
import { TranslationKit } from '../../translation-kit';
import { TranslationEngineType } from '../../common';
import * as toVFile from 'to-vfile';
import { tap } from 'rxjs/operators';

export const command = `translate <sourceGlob>`;

export const describe = '自动翻译 sourceGlob 中的文件，支持 html 和 markdown 两种格式';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  engine: {
    type: 'string',
    choices: [TranslationEngineType.google, TranslationEngineType.ms, TranslationEngineType.fake],
    default: TranslationEngineType.google,
  },
};

interface Params {
  sourceGlob: string;
  engine: TranslationEngineType;
}

export const handler = function ({ sourceGlob, engine }: Params) {
  const kit = new TranslationKit(engine);
  return kit.translateFiles(sourceGlob).pipe(
    tap(file => toVFile.writeSync(file)),
  ).subscribe();
};
