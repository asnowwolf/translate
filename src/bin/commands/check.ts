import { CommandBuilder } from 'yargs';
import { TranslationKit } from '../../translation-kit';
import { map, toArray } from 'rxjs/operators';
import { TranslationEngineType } from '../../common';
import { listFiles } from '../../rx-file';

export const command = `check <sourceGlob>`;

export const describe = '根据中英字符串长度粗略检查翻译结果';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  engine: {
    type: 'string',
    choices: [TranslationEngineType.google, TranslationEngineType.ms],
    default: TranslationEngineType.google,
  },
};

interface CheckParams {
  sourceGlob: string;
  engine: TranslationEngineType;
}

export const handler = function ({ sourceGlob, engine }: CheckParams) {
  const kit = new TranslationKit(engine);
  return kit.extractLowQualifyResults(listFiles(sourceGlob))
    .pipe(
      toArray(),
      map((pairs) => pairs.join('\n')),
    )
    .subscribe((pairs) => {
      console.log(pairs);
    });
};
