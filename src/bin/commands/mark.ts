import { CommandBuilder } from 'yargs';
import { listFiles } from '../../file-utils';
import { addTranslationMarks } from '../../translation-kit';

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
  const files = listFiles(sourceGlob);
  addTranslationMarks(files);
};
