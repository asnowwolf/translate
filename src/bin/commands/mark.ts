import { CommandBuilder } from 'yargs';
import { addTranslationMarks } from '../../translation-kit';
import * as toVFile from 'to-vfile';
import { tap } from 'rxjs/operators';

export const command = `mark <sourceGlob>`;

export const describe = '为双语 HTML 文件做后期处理，根据语种加上翻译标记';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
};

interface Params {
  sourceGlob: string;
}

export const handler = function ({ sourceGlob }: Params) {
  return addTranslationMarks(sourceGlob).pipe(
    tap(file => toVFile.writeSync(file)),
  ).subscribe();
};
