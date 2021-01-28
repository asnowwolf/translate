import { CommandBuilder } from 'yargs';
import { addTranslationMark } from '../../translation-kit';
import { readFileSync, writeFileSync } from 'fs';
import { sync as globby } from 'globby';

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
  const files = globby(sourceGlob);
  for (const file of files) {
    console.log('marking: ', file);
    const content = readFileSync(file, 'utf8');
    writeFileSync(file, addTranslationMark(content), 'utf8');
  }
};
