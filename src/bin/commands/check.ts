import { CommandBuilder } from 'yargs';
import { sync as globby } from 'globby';
import { getCheckerFor } from '../../checker/get-checker-for';

export const command = `check <sourceGlobs...>`;

export const describe = '检查是否有遗漏或错误的翻译';

export const builder: CommandBuilder = {
  sourceGlobs: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
};

interface Params {
  sourceGlobs: string[];
}

export const handler = function ({ sourceGlobs }: Params) {
  const filenames = globby(sourceGlobs);
  if (filenames.length === 0) {
    console.error('没有找到任何文件，请检查 sourceGlobs 是否正确！');
    return;
  }
  for (const filename of filenames) {
    console.log('checking: ', filename);
    const checker = getCheckerFor(filename);
    checker.checkFile(filename).then(result => {
      result.forEach(it => {
        console.error('file: ', it.filename);
        console.error('original: ', it.original);
        console.error('tokens: ', it.tokens);
      });
    });
  }
};
