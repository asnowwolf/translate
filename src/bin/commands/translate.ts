import { CommandBuilder } from 'yargs';
import { autoTranslateFiles } from '../../trans-kit';

export const command = `translate <sourceGlob> <outDir>`;

export const describe = '把 sourceGlob 中的内容自动翻译的 targetDir 中';

export const builder: CommandBuilder = {
  sourceGlob: {
    description: '文件通配符，注意：要包含在引号里，参见 https://github.com/isaacs/node-glob#glob-primer',
  },
  outDir: {
    description: '输出目录',
  },
};

interface Params {
  sourceGlob: string;
  outDir: string;
}

export const handler = function ({ sourceGlob, outDir }: Params) {
  return autoTranslateFiles(sourceGlob).subscribe((vfile) => {
    console.log(vfile.contents);
  });
};
