import { CommandBuilder } from 'yargs';
import { autoCheckFiles } from '../../trans-kit';
import { map, toArray } from 'rxjs/operators';

export const command = `check <sourceGlob>`;

export const describe = '根据中英字符串长度粗略检查翻译结果';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
};

interface CheckParams {
  sourceGlob: string;
}

export const handler = function ({ sourceGlob }: CheckParams) {
  return autoCheckFiles(sourceGlob)
    .pipe(
      toArray(),
      map((pairs) => pairs.join('\n')),
    )
    .subscribe((pairs) => {
      console.log(pairs);
    });
};
